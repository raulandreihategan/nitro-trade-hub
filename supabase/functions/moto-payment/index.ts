
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

class RealistoService {
  private baseUrl = "https://dashboard.realisto.net/api";
  private apiKey: string;
  private apiSecret: string;
  private authToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  async login(): Promise<string> {
    console.log("Attempting to authenticate with Realisto API");
    
    // Check if we have a valid token
    if (this.authToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      console.log("Using cached auth token");
      return this.authToken;
    }

    try {
      console.log("Making login request with API key/secret");
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_secret: this.apiSecret,
        }),
      });

      console.log("Login response status:", response.status);
      
      const responseText = await response.text();
      console.log("Login raw response:", responseText);
      
      if (!response.ok) {
        console.error("Login error response:", responseText);
        throw new Error(`Login failed with status ${response.status}: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        throw new Error(`Invalid JSON in login response: ${responseText}`);
      }
      
      console.log("Login response data:", JSON.stringify(data));

      if (!data.access_token && !data.token) {
        throw new Error(`No access token received in response: ${JSON.stringify(data)}`);
      }

      // Handle different response formats
      this.authToken = data.access_token || data.token;
      // Set token expiry to 9.5 minutes
      this.tokenExpiry = Date.now() + (9.5 * 60 * 1000);
      
      console.log("Successfully obtained access token");
      return this.authToken;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  async createOrder(orderData: any): Promise<any> {
    const token = await this.login();
    
    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

    try {
      // Ensure that URLs in OrdersApiData are properly formatted with order ID
      if (orderData.OrdersApiData) {
        const merchantOrderId = orderData.OrdersApiData.merchant_order_id || `order-${Date.now()}`;
        
        // Set a default merchant_order_id if not provided
        if (!orderData.OrdersApiData.merchant_order_id) {
          orderData.OrdersApiData.merchant_order_id = merchantOrderId;
          console.log("Generated merchant_order_id:", merchantOrderId);
        }
        
        // Make sure okUrl and koUrl have the order ID parameter
        if (orderData.OrdersApiData.okUrl && !orderData.OrdersApiData.okUrl.includes('?id=')) {
          orderData.OrdersApiData.okUrl = `${orderData.OrdersApiData.okUrl}?id=${merchantOrderId}`;
          console.log("Updated okUrl:", orderData.OrdersApiData.okUrl);
        }
        
        if (orderData.OrdersApiData.koUrl && !orderData.OrdersApiData.koUrl.includes('?id=')) {
          orderData.OrdersApiData.koUrl = `${orderData.OrdersApiData.koUrl}?id=${merchantOrderId}`;
          console.log("Updated koUrl:", orderData.OrdersApiData.koUrl);
        }
      }

      console.log("Making request to API with prepared data:", JSON.stringify(orderData, null, 2));

      const response = await fetch(`${this.baseUrl}/orders/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("Create order response status:", response.status);
      
      const responseText = await response.text();
      console.log("API Response raw text:", responseText);

      if (!response.ok) {
        throw new Error(`Failed to create order: ${responseText}`);
      }

      try {
        const data = JSON.parse(responseText);
        console.log("Parsed response data:", JSON.stringify(data, null, 2));
        return data;
      } catch (e) {
        console.log("Response was not JSON, checking if it's a direct URL");
        // If response is not JSON but contains http, it might be a direct URL
        if (responseText.trim().startsWith('http')) {
          return { pay_url: responseText.trim() };
        }
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    // Using API key/secret authentication
    const REALISTO_API_KEY = Deno.env.get("MOTO_API_KEY") || "OMTTHrkXBzH_bZTtNeW0FowWpdHu9YJK0_KN";
    const REALISTO_API_SECRET = Deno.env.get("MOTO_API_SECRET") || "RLC7VwpLmgoLu1hufBJ-R8aXjybijRRrUmPM";
    
    if (!REALISTO_API_KEY || !REALISTO_API_SECRET) {
      console.error("Missing credentials:", { apiKey: !!REALISTO_API_KEY, apiSecret: !!REALISTO_API_SECRET });
      throw new Error("Missing Realisto API credentials");
    }

    console.log("API credentials loaded successfully");
    const service = new RealistoService(REALISTO_API_KEY, REALISTO_API_SECRET);

    // Parse request body
    const body = await req.json();
    console.log("Received request:", JSON.stringify(body, null, 2));

    if (!body.action) {
      throw new Error("Missing action parameter");
    }

    let result;
    switch (body.action) {
      case "create-order":
        if (!body.Orders?.amount) {
          throw new Error("Missing required field: Orders.amount");
        }
        
        if (!body.Customers?.client_name || !body.Customers?.mail) {
          throw new Error("Missing required customer information");
        }
        
        if (!body.OrdersApiData?.okUrl || !body.OrdersApiData?.koUrl) {
          throw new Error("Missing required URLs");
        }

        result = await service.createOrder({
          Orders: body.Orders,
          Customers: body.Customers,
          OrdersApiData: body.OrdersApiData
        });
        break;

      case "orders-list":
      case "get-terminals":
      case "cancel-order":
      case "refund-order":
        throw new Error(`${body.action} not implemented yet`);

      default:
        throw new Error("Invalid action");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error: any) {
    console.error("Operation failed:", error);
    return new Response(JSON.stringify({
      error: error.message,
      details: "Operation failed with the Realisto API"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
