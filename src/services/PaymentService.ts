
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
      
      // Clean up undefined values to prevent issues with the API
      const cleanedOrderData = JSON.parse(JSON.stringify(orderData));
      
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'create-order',
          ...cleanedOrderData,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
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
