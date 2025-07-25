
import { supabase } from "@/integrations/supabase/client";
import { cleanCustomerData, validateCountryFormat, formatPhoneNumber, generateMerchantOrderId } from "@/utils/paymentValidation";
import { prepareOrderPayload, extractPaymentUrl } from "@/utils/paymentTransform";
import { handlePaymentError } from "@/utils/paymentErrors";
import { convertCurrency } from "@/utils/currencyConverter";

/**
 * Handles interactions with the MOTO payment API
 */
export class PaymentService {
  /**
   * Creates a new payment order
   */
  static async createOrder(orderData: {
    Orders: {
      terminal_id: number;
      amount: string;
      lang: number;
      skip_email?: number;
      send_sms?: boolean;
      repeat_count?: number;
      is_recurring?: boolean | number;
      repeat_time?: number;
      repeat_period?: number;
      is_auth?: boolean;
      merchant_order_description?: string;
      currency?: string; // Added currency field
    };
    Customers: {
      client_name: string;
      mail: string;
      mobile?: string;
      tax_id?: string;
      country?: string;
      city?: string;
      state?: string;
      zip?: string;
      address?: string;
    };
    OrdersApiData: {
      okUrl: string;
      koUrl: string;
      incrementId?: string;
      merchant_order_id?: string;
    };
  }) {
    try {
      console.log('Creating payment order with data:', orderData);
      
      // Clean up customer data
      const customers = cleanCustomerData(orderData.Customers);
      
      // Validate country format if provided
      if (customers.country) {
        const countryValidation = validateCountryFormat(customers.country);
        if (!countryValidation.isValid && countryValidation.message) {
          console.log(countryValidation.message);
          throw new Error(countryValidation.message);
        }
      }
      
      // Format mobile phone number if present
      if (customers.mobile) {
        // Validate phone format
        const phoneNumber = customers.mobile.replace(/\s+/g, '');
        if (!phoneNumber.startsWith('+') || phoneNumber.length < 8) {
          throw new Error('Phone must be in international format starting with +');
        }
        
        customers.mobile = formatPhoneNumber(customers.mobile);
        console.log('Formatted mobile number:', customers.mobile);
      }
      
      // Re-assign the cleaned customer data
      orderData.Customers = customers as {
        client_name: string;
        mail: string;
        mobile?: string;
        tax_id?: string;
        country?: string;
        city?: string;
        state?: string;
        zip?: string;
        address?: string;
      };

      // Always set terminal ID to 1439
      orderData.Orders.terminal_id = 1439;
      console.log('Set terminal_id to 1439');

      // Convert lang to string
      if (typeof orderData.Orders.lang === 'number') {
        orderData.Orders.lang = String(orderData.Orders.lang) as any;
        console.log('Converted lang to string:', orderData.Orders.lang);
      }

      // Handle currency - always send EUR to the payment API
      const originalAmount = parseFloat(orderData.Orders.amount);
      const originalCurrency = orderData.Orders.currency || 'USD';
      
      // If the original currency is not EUR, convert it
      let finalAmount = originalAmount;
      if (originalCurrency !== 'EUR') {
        finalAmount = convertCurrency(originalAmount, originalCurrency, 'EUR');
        console.log(`Currency conversion: ${originalAmount} ${originalCurrency} => ${finalAmount} EUR`);
      } else {
        console.log(`Original currency is EUR, no conversion needed: ${originalAmount} EUR`);
      }
      
      // Update the amount with the final value
      orderData.Orders.amount = finalAmount.toString();
      
      // Add original currency info to the description if needed
      if (originalCurrency !== 'EUR') {
        const currencyInfo = `(Original: ${originalAmount} ${originalCurrency})`;
        if (orderData.Orders.merchant_order_description) {
          orderData.Orders.merchant_order_description += ` ${currencyInfo}`;
        } else {
          orderData.Orders.merchant_order_description = `Order ${currencyInfo}`;
        }
      }
      
      // Always set the currency to EUR for the payment API
      orderData.Orders.currency = 'EUR';

      // Generate a merchant_order_id if not provided
      if (!orderData.OrdersApiData.merchant_order_id) {
        orderData.OrdersApiData.merchant_order_id = generateMerchantOrderId();
        console.log('Generated merchant_order_id:', orderData.OrdersApiData.merchant_order_id);
      }

      // Get order items to create a detailed description
      const orderId = orderData.OrdersApiData.merchant_order_id;
      let orderDescription = orderData.Orders.merchant_order_description || `Order ${orderId}`;
      
      try {
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', orderId);
          
        if (orderItems && orderItems.length > 0) {
          // Create a more descriptive order description
          const itemDescriptions = orderItems.map(item => 
            `${item.service_title} (${item.option_name})`
          );
          
          orderDescription = `Purchase of: ${itemDescriptions.join(', ')}`;
          console.log('Generated detailed order description:', orderDescription);
        }
      } catch (err) {
        console.log('Could not fetch order items for description, using default', err);
      }
      
      // Set the updated description
      orderData.Orders.merchant_order_description = orderDescription;

      // Prepare the order data for API
      const apiPayload = prepareOrderPayload(orderData);
      console.log('Sending formatted order data to API:', JSON.stringify(apiPayload, null, 2));

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'create-order',
          ...apiPayload
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw handlePaymentError(error);
      }

      if (!data) {
        throw new Error('No response received from payment gateway');
      }
      
      console.log('Payment order created successfully:', data);
      
      // Extract payment URL from response
      const paymentUrl = extractPaymentUrl(data);
      
      if (paymentUrl) {
        console.log('Payment URL found:', paymentUrl);
        return { success: true, data, paymentUrl };
      } else {
        console.error('No payment URL could be extracted from API response:', data);
        throw new Error('No payment URL found in the payment gateway response');
      }
    } catch (error: any) {
      console.error('Error creating payment order:', error);
      // Return a proper error object with the error info
      return { 
        success: false, 
        error: handlePaymentError(error) 
      };
    }
  }

  /**
   * Gets a list of orders with optional filters
   */
  static async getOrdersList(filters: {
    order?: number;
    amount?: number;
    status?: number;
    email?: string;
  } = {}) {
    try {
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'orders-list',
          ...filters
        },
      });

      if (error) throw handlePaymentError(error);
      return data;
    } catch (error) {
      console.error('Error getting orders list:', error);
      throw handlePaymentError(error);
    }
  }

  /**
   * Gets a list of available payment terminals
   */
  static async getTerminals() {
    try {
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'get-terminals'
        },
      });

      if (error) throw handlePaymentError(error);
      return data;
    } catch (error) {
      console.error('Error getting terminals:', error);
      throw handlePaymentError(error);
    }
  }

  /**
   * Cancels an order
   * @param orderId The ID of the order to cancel
   */
  static async cancelOrder(orderId: number) {
    try {
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: { 
          action: 'cancel-order',
          orderId 
        },
      });

      if (error) throw handlePaymentError(error);
      return data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw handlePaymentError(error);
    }
  }

  /**
   * Refunds an order
   * @param orderId The ID of the order to refund
   * @param amount The amount to refund
   */
  static async refundOrder(orderId: number, amount: string) {
    try {
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: { 
          action: 'refund-order',
          orderId, 
          amount 
        },
      });

      if (error) throw handlePaymentError(error);
      return data;
    } catch (error) {
      console.error('Error refunding order:', error);
      throw handlePaymentError(error);
    }
  }
}
