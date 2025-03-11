
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles interactions with the MOTO payment API
 */
export class PaymentService {
  /**
   * Creates a new payment order
   * @param orderData Order data as required by the MOTO API
   */
  static async createOrder(orderData: {
    Orders: {
      terminal_id: number;
      amount: string;
      lang: number;
      skip_email?: number;
      send_sms?: boolean;
      is_recurring?: boolean;
      is_auth?: boolean;
      merchant_order_description?: string;
    };
    Customers: {
      client_name: string;
      mail: string;
      mobile?: string;
      country?: string;
      city?: string;
      state?: string;
      zip?: string;
      address?: string;
    };
    OrdersApiData: {
      okUrl: string;
      koUrl: string;
      merchant_order_id?: string;
    };
  }) {
    try {
      console.log('Creating payment order with data:', orderData);
      
      // Deep clean the orderData to remove undefined values, null values, and empty strings
      const cleanOrderData = (obj: any): any => {
        if (obj === null || obj === undefined) return undefined;
        if (typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) {
          return obj.map(cleanOrderData).filter(item => item !== undefined);
        }
        
        const result: any = {};
        let isEmpty = true;
        
        for (const key in obj) {
          const value = cleanOrderData(obj[key]);
          if (value !== undefined && value !== '' && value !== null) {
            result[key] = value;
            isEmpty = false;
          }
        }
        
        return isEmpty ? undefined : result;
      };
      
      const cleanedData = cleanOrderData(orderData);
      console.log('Cleaned payment order data:', cleanedData);
      
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'create-order',
          ...cleanedData,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Enhance the koUrl with error information if possible
        if (cleanedData.OrdersApiData && cleanedData.OrdersApiData.koUrl) {
          const errorMessage = error.message || "Payment processing failed";
          const errorDetails = error.details || "Please check with support or try again";
          
          // Create a URL object to manipulate the URL
          const koUrl = new URL(cleanedData.OrdersApiData.koUrl);
          
          // Add error as a URL parameter, properly encoded
          const errorObj = {
            error: errorMessage,
            details: errorDetails
          };
          koUrl.searchParams.set('error', encodeURIComponent(JSON.stringify(errorObj)));
          
          // Redirect to the enhanced failure URL
          window.location.href = koUrl.toString();
          return null;
        }
        
        throw error;
      }
      
      console.log('Payment order created successfully:', data);
      
      // Check if we have a payment URL to redirect to
      if (data && data.body && data.body.pay_url) {
        console.log('Redirecting to payment page:', data.body.pay_url);
        return data;
      } else {
        console.error('No payment URL returned from API:', data);
        throw new Error('No payment URL returned from the payment gateway');
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
