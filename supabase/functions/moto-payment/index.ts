
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
    if (!apiKey || !apiSecret) {
      throw new Error("API key or secret is empty or undefined");
    }
    
    console.log(`Using credentials: API Key starts with: ${apiKey.substring(0, 3)}... and API Secret starts with: ${apiSecret.substring(0, 3)}...`);
    
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

    const responseText = await response.text();
    console.log(`Login response status: ${response.status}`);
    
    // Log a portion of the response for debugging
    if (responseText.length > 200) {
      console.log(`Login response body (truncated): ${responseText.substring(0, 200)}...`);
    } else {
      console.log(`Login response body: ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from login: ${responseText}`);
    }

    if (!data.access_token) {
      throw new Error(data.messages || "Failed to get access token");
    }

    accessToken = data.access_token;
    // Set token expiry to 1 hour (adjust based on actual token lifetime)
    tokenExpiry = Date.now() + 3600000;
    
    console.log("Successfully obtained access token");
    return accessToken;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
}

async function createOrder(token: string, orderData: any) {
  console.log("Creating order with data:", JSON.stringify(orderData, null, 2));
  
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
    console.log(`MOTO API response status: ${response.status}`);
    
    // Log a portion of the response for debugging
    if (responseText.length > 200) {
      console.log(`MOTO API response body (truncated): ${responseText.substring(0, 200)}...`);
    } else {
      console.log(`MOTO API response body: ${responseText}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from orders/create: ${responseText}`);
    }
    
    if (!response.ok) {
      throw new Error(data.messages || data.error || `Failed to create order: ${response.status}`);
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

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to get orders list: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from orders/list: ${responseText}`);
    }
    
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

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from orders/cancel: ${responseText}`);
    }
    
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

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Failed to refund order: ${response.status} - ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response from orders/refund: ${responseText}`);
    }
    
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
    console.log("Handling OPTIONS request");
    return new Response(null, { 
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const MOTO_API_KEY = Deno.env.get("MOTO_API_KEY");
    const MOTO_API_SECRET = Deno.env.get("MOTO_API_SECRET");
    
    if (!MOTO_API_KEY || !MOTO_API_SECRET) {
      console.error("MOTO API credentials are not set in environment variables");
      return new Response(JSON.stringify({ 
        error: "MOTO API credentials are not configured properly on the server" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    console.log("API credentials found, proceeding with request");

    // Get the request body
    let body = {};
    try {
      body = await req.json();
      console.log("Request body:", JSON.stringify(body, null, 2));
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
      console.log("Got access token successfully");
    } catch (error) {
      console.error("Failed to get access token:", error);
      return new Response(JSON.stringify({ 
        error: `Authentication failed with MOTO API: ${error.message}`,
        details: "Please check the MOTO API credentials in your environment variables."
      }), {
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
          
          // Validate required order data
          if (!orderData.Orders || !orderData.Orders.amount) {
            return new Response(JSON.stringify({ error: "Orders.amount is required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          
          if (!orderData.Customers || !orderData.Customers.client_name || !orderData.Customers.mail) {
            return new Response(JSON.stringify({ error: "Customers.client_name and Customers.mail are required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          
          if (!orderData.OrdersApiData || !orderData.OrdersApiData.okUrl || !orderData.OrdersApiData.koUrl) {
            return new Response(JSON.stringify({ error: "OrdersApiData.okUrl and OrdersApiData.koUrl are required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          
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

      console.log("Operation successful, returning result:", JSON.stringify(result, null, 2));
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Operation failed:", error);
      return new Response(JSON.stringify({ 
        error: error.message,
        details: "Operation failed with the MOTO API"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response(JSON.stringify({ 
      error: "An unexpected error occurred",
      details: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
