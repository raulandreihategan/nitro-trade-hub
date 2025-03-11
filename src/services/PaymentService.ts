
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
      
      // Ensure URLs include the order ID parameter if it exists
      if (orderData.OrdersApiData.merchant_order_id) {
        if (!orderData.OrdersApiData.okUrl.includes('?id=')) {
          orderData.OrdersApiData.okUrl = `${orderData.OrdersApiData.okUrl}?id=${orderData.OrdersApiData.merchant_order_id}`;
        }
        
        if (!orderData.OrdersApiData.koUrl.includes('?id=')) {
          orderData.OrdersApiData.koUrl = `${orderData.OrdersApiData.koUrl}?id=${orderData.OrdersApiData.merchant_order_id}`;
        }
      }
      
      const { data, error } = await supabase.functions.invoke('moto-payment', {
        body: {
          action: 'create-order',
          ...orderData,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Payment order created successfully:', data);
      
      // Check different possible response structures for the payment URL
      let paymentUrl = null;
      
      if (data) {
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
