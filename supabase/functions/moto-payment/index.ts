
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MOTO_API_BASE_URL = "https://dashboard.realisto.net";
let accessToken = null;
let tokenExpiry = null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(apiKey: string, apiSecret: string) {
  // Return cached token if it's still valid
  if (accessToken && tokenExpiry && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await fetch(`${MOTO_API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        api_secret: apiSecret,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      throw new Error(data.messages || "Failed to get access token");
    }

    accessToken = data.access_token;
    // Set token expiry to 1 hour (adjust based on actual token lifetime)
    tokenExpiry = Date.now() + 3600000;
    
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

async function createOrder(token: string, orderData: any) {
  try {
    const response = await fetch(`${MOTO_API_BASE_URL}/api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.messages || "Failed to create order");
    }

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

async function getOrdersList(token: string, queryParams: any = {}) {
  try {
    const url = new URL(`${MOTO_API_BASE_URL}/api/orders/list`);
    
    // Add query parameters if provided
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key]) {
        url.searchParams.append(key, queryParams[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.messages || "Failed to get orders list");
    }

    return data;
  } catch (error) {
    console.error("Error getting orders list:", error);
    throw error;
  }
}

async function cancelOrder(token: string, orderId: number) {
  try {
    const response = await fetch(`${MOTO_API_BASE_URL}/api/orders/cancel/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.messages || "Failed to cancel order");
    }

    return data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
}

async function refundOrder(token: string, orderId: number, amount: string) {
  try {
    const response = await fetch(`${MOTO_API_BASE_URL}/api/orders/refund/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        refund_amount: amount
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.messages || "Failed to refund order");
    }

    return data;
  } catch (error) {
    console.error("Error refunding order:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MOTO_API_KEY = Deno.env.get("MOTO_API_KEY");
    const MOTO_API_SECRET = Deno.env.get("MOTO_API_SECRET");
    
    if (!MOTO_API_KEY || !MOTO_API_SECRET) {
      throw new Error("MOTO API credentials are not set");
    }

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();
    
    // Get the request body
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // If there's no body or it's not JSON, continue with empty object
    }

    // Get access token
    const token = await getAccessToken(MOTO_API_KEY, MOTO_API_SECRET);

    let result;

    switch (path) {
      case "create-order":
        result = await createOrder(token, body);
        break;
      case "orders-list":
        result = await getOrdersList(token, body);
        break;
      case "cancel-order":
        if (!body.orderId) {
          throw new Error("Order ID is required");
        }
        result = await cancelOrder(token, body.orderId);
        break;
      case "refund-order":
        if (!body.orderId || !body.amount) {
          throw new Error("Order ID and amount are required");
        }
        result = await refundOrder(token, body.orderId, body.amount);
        break;
      default:
        throw new Error("Invalid endpoint");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
