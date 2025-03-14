import { supabase } from "@/integrations/supabase/client";

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
      
      // Clean up customer data to ensure no undefined values are sent
      const customers = { ...orderData.Customers };
      
      // Filter out undefined or null values
      Object.keys(customers).forEach(key => {
        const value = customers[key as keyof typeof customers];
        if (
          value === undefined || 
          value === null ||
          (typeof value === 'object' && value !== null && 
            '_type' in value && (value as any)?._type === 'undefined')
        ) {
          delete customers[key as keyof typeof customers];
        }
      });
      
      // Format the country value to ISO format if it exists
      if (customers.country) {
        // Ensure it's a proper ISO country code (3-letter format)
        // Convert full names to codes if needed or validate existing codes
        const countryValue = customers.country.trim();
        // Keep only if it's a valid 3-letter ISO code format
        if (!/^[A-Z]{3}$/.test(countryValue)) {
          console.log(`Country format might be invalid: ${countryValue}. The API expects 3-letter ISO country codes.`);
        }
      }
      
      // Re-assign the cleaned customer data
      orderData.Customers = customers;

      // Generate a merchant_order_id if not provided
      if (!orderData.OrdersApiData.merchant_order_id) {
        orderData.OrdersApiData.merchant_order_id = `order-${Date.now()}`;
        console.log('Generated merchant_order_id:', orderData.OrdersApiData.merchant_order_id);
      }

      // Format mobile phone number if present
      if (orderData.Customers && orderData.Customers.mobile) {
        const phoneNumber = orderData.Customers.mobile.replace(/\s+/g, '');
        orderData.Customers.mobile = phoneNumber.startsWith('+') 
          ? phoneNumber 
          : `+${phoneNumber}`;
        console.log('Formatted mobile number:', orderData.Customers.mobile);
      }

      // Prepare the order data exactly as expected by the API - matching the PHP example structure precisely
      const apiPayload = {
        action: 'create-order', // Will be stripped by the edge function
        Orders: {
          terminal_id: orderData.Orders.terminal_id,
          amount: orderData.Orders.amount,
          lang: orderData.Orders.lang,
          skip_email: orderData.Orders.skip_email || 0,
          is_recurring: typeof orderData.Orders.is_recurring === 'boolean' 
            ? (orderData.Orders.is_recurring ? 1 : 0) 
            : (orderData.Orders.is_recurring || 0),
          repeat_count: orderData.Orders.repeat_count,
          repeat_time: orderData.Orders.repeat_time,
          repeat_period: orderData.Orders.repeat_period,
          is_auth: orderData.Orders.is_auth ? 1 : 0,
          merchant_order_description: orderData.Orders.merchant_order_description,
        },
        Customers: orderData.Customers,
        OrdersApiData: {
          incrementId: orderData.OrdersApiData.incrementId || orderData.OrdersApiData.merchant_order_id,
          okUrl: orderData.OrdersApiData.okUrl,
          koUrl: orderData.OrdersApiData.koUrl,
          merchant_order_id: orderData.OrdersApiData.merchant_order_id
        }
      };

      console.log('Sending formatted order data to API:', JSON.stringify(apiPayload, null, 2));

      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: apiPayload,
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Enhanced error handling
        if (typeof error === 'object' && error !== null) {
          // Check for specific error types
          if ('message' in error && typeof error.message === 'string') {
            if (error.message.includes('mobile')) {
              throw new Error('Invalid phone number format. Please use international format (e.g., +34644982327)');
            }
            if (error.message.includes('country')) {
              throw new Error('Country format is invalid. Please use a 3-letter ISO country code (e.g., ESP for Spain)');
            }
            if (error.message.includes('API key')) {
              throw new Error('Payment system configuration error: Invalid API key format');
            }
            if (error.message.includes('API secret')) {
              throw new Error('Payment system configuration error: Invalid API secret format');
            }
          }
        }
        
        throw error;
      }
      
      console.log('Payment order created successfully:', data);
      
      // Check different possible response structures for the payment URL
      let paymentUrl = null;
      
      if (data) {
        // Log the full response for debugging
        console.log('Full API response:', JSON.stringify(data, null, 2));
        
        // Try accessing the URL from various possible response structures
        if (data.pay_url) {
          paymentUrl = data.pay_url;
        } else if (data.body && data.body.pay_url) {
          paymentUrl = data.body.pay_url;
        } else if (data.response && data.response.pay_url) {
          paymentUrl = data.response.pay_url;
        } else if (typeof data === 'string' && data.includes('http')) {
          // In case API returns a direct URL string
          paymentUrl = data.trim();
        }
        
        // Log what we found for debugging
        console.log('Payment URL found:', paymentUrl);
        
        if (paymentUrl) {
          console.log('Redirecting to payment page:', paymentUrl);
          window.location.href = paymentUrl;
          return data;
        } else {
          console.error('No payment URL could be extracted from API response:', data);
          throw new Error('No payment URL found in the payment gateway response');
        }
      } else {
        console.error('No data returned from API');
        throw new Error('No response received from the payment gateway');
      }
    } catch (error: any) {
      console.error('Error creating payment order:', error);
      throw error;
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting orders list:', error);
      throw error;
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting terminals:', error);
      throw error;
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
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

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error refunding order:', error);
      throw error;
    }
  }
}
