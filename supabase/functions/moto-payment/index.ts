
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login error response:", errorText);
        throw new Error(`Login failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Login response:", JSON.stringify(data));

      if (!data.access_token) {
        throw new Error("No access token received");
      }

      this.authToken = data.access_token;
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
      // Ensure that URLs in OrdersApiData are properly formatted
      if (orderData.OrdersApiData) {
        // Make sure okUrl and koUrl have the order ID parameter
        if (orderData.OrdersApiData.okUrl && !orderData.OrdersApiData.okUrl.includes('?id=')) {
          const orderId = orderData.OrdersApiData.merchant_order_id;
          if (orderId) {
            orderData.OrdersApiData.okUrl = `${orderData.OrdersApiData.okUrl}?id=${orderId}`;
          }
        }
        
        if (orderData.OrdersApiData.koUrl && !orderData.OrdersApiData.koUrl.includes('?id=')) {
          const orderId = orderData.OrdersApiData.merchant_order_id;
          if (orderId) {
            orderData.OrdersApiData.koUrl = `${orderData.OrdersApiData.koUrl}?id=${orderId}`;
          }
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
        throw new Error(`Invalid JSON response: ${responseText}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
  
  // Additional methods for other operations can be added here
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
    const MOTO_API_KEY = Deno.env.get("MOTO_API_KEY");
    const MOTO_API_SECRET = Deno.env.get("MOTO_API_SECRET");
    
    if (!MOTO_API_KEY || !MOTO_API_SECRET) {
      console.error("Missing API credentials:", { key: !!MOTO_API_KEY, secret: !!MOTO_API_SECRET });
      throw new Error("Missing MOTO API credentials");
    }

    console.log("API credentials loaded successfully");
    const service = new RealistoService(MOTO_API_KEY, MOTO_API_SECRET);

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

        if (!body.OrdersApiData.merchant_order_id) {
          console.warn("merchant_order_id is missing, this may cause issues with redirection");
        }

        result = await service.createOrder({
          Orders: body.Orders,
          Customers: body.Customers,
          OrdersApiData: body.OrdersApiData
        });
        break;

      case "orders-list":
        // For future implementation
        throw new Error("Orders list not implemented yet");
        
      case "get-terminals":
        // For future implementation
        throw new Error("Get terminals not implemented yet");
        
      case "cancel-order":
        // For future implementation
        throw new Error("Cancel order not implemented yet");
        
      case "refund-order":
        // For future implementation
        throw new Error("Refund order not implemented yet");

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
      details: "Operation failed with the MOTO API"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
