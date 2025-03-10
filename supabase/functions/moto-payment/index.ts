
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
    console.log("Using cached token");
    return accessToken;
  }

  console.log("Getting new access token");
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Login failed with status ${response.status}: ${errorText}`);
      throw new Error(`Login failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Login response:", data);

    if (!data.access_token) {
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
  console.log("Creating order with data:", orderData);
  try {
    const response = await fetch(`${MOTO_API_BASE_URL}/api/orders/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const responseText = await response.text();
    console.log(`MOTO API response status: ${response.status}, text: ${responseText}`);
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    if (!response.ok) {
      throw new Error(data.messages || `Failed to create order: ${response.status}`);
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

    console.log("Getting orders list from URL:", url.toString());
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get orders list: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Orders list response:", data);
    
    return data;
  } catch (error) {
    console.error("Error getting orders list:", error);
    throw error;
  }
}

async function cancelOrder(token: string, orderId: number) {
  try {
    console.log("Canceling order ID:", orderId);
    const response = await fetch(`${MOTO_API_BASE_URL}/api/orders/cancel/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to cancel order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Cancel order response:", data);
    
    return data;
  } catch (error) {
    console.error("Error canceling order:", error);
    throw error;
  }
}

async function refundOrder(token: string, orderId: number, amount: string) {
  try {
    console.log("Refunding order ID:", orderId, "amount:", amount);
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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refund order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Refund order response:", data);
    
    return data;
  } catch (error) {
    console.error("Error refunding order:", error);
    throw error;
  }
}

serve(async (req) => {
  console.log("Received request:", req.method, req.url);
  
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

    console.log("API credentials found, proceeding with request");

    // Get the request body
    let body = {};
    try {
      body = await req.json();
      console.log("Request body:", body);
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const action = body.action;
    if (!action) {
      return new Response(JSON.stringify({ error: "Action is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get access token
    let token;
    try {
      token = await getAccessToken(MOTO_API_KEY, MOTO_API_SECRET);
      console.log("Got access token");
    } catch (error) {
      console.error("Failed to get access token:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    let result;

    try {
      switch (action) {
        case "create-order":
          // Remove the action from the body before passing to the API
          const { action: _, ...orderData } = body;
          result = await createOrder(token, orderData);
          break;
        case "orders-list":
          // Remove action from filters
          const { action: __, ...filters } = body;
          result = await getOrdersList(token, filters);
          break;
        case "cancel-order":
          if (!body.orderId) {
            return new Response(JSON.stringify({ error: "Order ID is required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          result = await cancelOrder(token, body.orderId);
          break;
        case "refund-order":
          if (!body.orderId || !body.amount) {
            return new Response(JSON.stringify({ error: "Order ID and amount are required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          result = await refundOrder(token, body.orderId, body.amount);
          break;
        default:
          return new Response(JSON.stringify({ error: "Invalid action" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          });
      }

      console.log("Operation successful, returning result:", result);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Operation failed:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
