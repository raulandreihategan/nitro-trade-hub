
/**
 * Transforms payment data for API requests
 */

/**
 * Prepares the order data for API request
 */
export const prepareOrderPayload = (orderData: {
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
}): any => {
  // Prepare the order data exactly as expected by the API
  return {
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
};

/**
 * Extracts payment URL from API response
 */
export const extractPaymentUrl = (data: any): string | null => {
  if (!data) return null;
  
  if (data.pay_url) {
    return data.pay_url;
  } else if (data.body && data.body.pay_url) {
    return data.body.pay_url;
  } else if (data.response && data.response.pay_url) {
    return data.response.pay_url;
  } else if (typeof data === 'string' && data.includes('http')) {
    return data.trim();
  }
  
  return null;
};
