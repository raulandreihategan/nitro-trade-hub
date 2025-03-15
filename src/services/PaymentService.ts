
import { supabase } from "@/integrations/supabase/client";
import { cleanCustomerData, validateCountryFormat, formatPhoneNumber, generateMerchantOrderId } from "@/utils/paymentValidation";
import { prepareOrderPayload, extractPaymentUrl } from "@/utils/paymentTransform";
import { handlePaymentError } from "@/utils/paymentErrors";

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
        }
      }
      
      // Format mobile phone number if present
      if (customers.mobile) {
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

      // Always set terminal ID to 88
      orderData.Orders.terminal_id = 88;
      console.log('Set terminal_id to 88');

      // Convert lang to string
      if (typeof orderData.Orders.lang === 'number') {
        orderData.Orders.lang = String(orderData.Orders.lang) as any;
        console.log('Converted lang to string:', orderData.Orders.lang);
      }

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
      
      console.log('Payment order created successfully:', data);
      
      // Extract payment URL from response
      const paymentUrl = extractPaymentUrl(data);
      
      if (paymentUrl) {
        console.log('Redirecting to payment page:', paymentUrl);
        window.location.href = paymentUrl;
        return data;
      } else {
        console.error('No payment URL could be extracted from API response:', data);
        throw new Error('No payment URL found in the payment gateway response');
      }
    } catch (error: any) {
      console.error('Error creating payment order:', error);
      throw handlePaymentError(error);
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
