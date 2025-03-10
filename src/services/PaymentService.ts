
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
      
      // Deep clean the orderData to remove undefined values, null values, and objects with "_type": "undefined"
      const cleanedOrderData = JSON.parse(JSON.stringify(orderData, (key, value) => {
        // Check if this is a special undefined object created by some frameworks
        if (value && typeof value === 'object' && value._type === 'undefined') {
          return undefined;
        }
        return value;
      }));
      
      // Remove any undefined/null properties that may cause issues with the API
      const cleanNestedObject = (obj: any) => {
        Object.keys(obj).forEach(key => {
          if (obj[key] === undefined || obj[key] === null) {
            delete obj[key];
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            cleanNestedObject(obj[key]);
            // Remove empty objects
            if (Object.keys(obj[key]).length === 0) {
              delete obj[key];
            }
          }
        });
        return obj;
      };
      
      // Apply the cleaning recursively
      const finalOrderData = cleanNestedObject(cleanedOrderData);
      
      console.log('Cleaned payment order data:', finalOrderData);
      
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'create-order',
          ...finalOrderData,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        // Enhance the koUrl with error information if possible
        if (finalOrderData.OrdersApiData && finalOrderData.OrdersApiData.koUrl) {
          let errorMessage = error.message || "Payment processing failed";
          
          // Create a URL object to manipulate the URL
          const koUrl = new URL(finalOrderData.OrdersApiData.koUrl);
          
          // Add error as a URL parameter, properly encoded
          const errorObj = {
            error: errorMessage,
            details: "Please check with support or try again"
          };
          koUrl.searchParams.set('error', encodeURIComponent(JSON.stringify(errorObj)));
          
          // Redirect to the enhanced failure URL
          window.location.href = koUrl.toString();
          return null;
        }
        throw error;
      }
      
      console.log('Payment order created:', data);
      return data;
    } catch (error) {
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
