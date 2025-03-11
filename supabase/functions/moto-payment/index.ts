
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Realisto API service class
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
      if (!this.apiKey || !this.apiSecret) {
        throw new Error("API key or secret is empty or undefined");
      }
      
      console.log(`Using credentials: API Key starts with: ${this.apiKey.substring(0, 3)}... and API Secret starts with: ${this.apiSecret.substring(0, 3)}...`);
      
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

      this.authToken = data.access_token;
      // Set token expiry to 9.5 minutes (570 seconds) to be safe
      this.tokenExpiry = Date.now() + (9.5 * 60 * 1000);
      
      console.log("Successfully obtained access token");
      return this.authToken;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  async executeRequest(url: string, data: any = {}, method: string = "POST"): Promise<any> {
    // Make sure we have a valid token
    const token = await this.login();
    const fullUrl = `${this.baseUrl}${url}`;
    
    console.log(`Executing ${method} request to ${fullUrl}`);
    
    const headers: HeadersInit = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (method.toUpperCase() === "GET") {
      // For GET requests, add params to URL
      const params = new URLSearchParams();
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          params.append(key, data[key]);
        }
      }
      
      const queryString = params.toString();
      if (queryString) {
        const separator = url.includes("?") ? "&" : "?";
        url = `${url}${separator}${queryString}`;
      }
    } else if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
      // For other methods, add data to body
      options.body = JSON.stringify(data);
    }

    try {
      console.log(`Request options: ${JSON.stringify(options, null, 2)}`);
      
      const response = await fetch(fullUrl, options);
      const responseText = await response.text();
      
      console.log(`API response status: ${response.status}`);
      if (responseText.length > 200) {
        console.log(`API response body (truncated): ${responseText.substring(0, 200)}...`);
      } else {
        console.log(`API response body: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${responseText}`);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      return responseData;
    } catch (error) {
      console.error(`Error executing ${method} request to ${url}:`, error);
      throw error;
    }
  }

  // Order methods
  async createOrder(orderData: any): Promise<any> {
    return this.executeRequest("/orders/create", orderData);
  }

  async getOrdersList(params: any = {}): Promise<any> {
    return this.executeRequest("/orders/list", params, "GET");
  }

  async cancelOrder(orderId: number): Promise<any> {
    return this.executeRequest(`/orders/cancel/${orderId}`, {}, "GET");
  }

  async refundOrder(orderId: number, amount: string): Promise<any> {
    return this.executeRequest(`/orders/refund/${orderId}`, { refund_amount: amount });
  }

  // Terminal methods
  async getTerminalList(): Promise<any> {
    return this.executeRequest("/terminals/list", {}, "GET");
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
    
    // Initialize the Realisto API service
    const realistoService = new RealistoService(MOTO_API_KEY, MOTO_API_SECRET);

    // Parse request body
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

    let result;
    try {
      switch (action) {
        case "create-order":
          // Extract order data from body, removing the action field
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
          
          // Clean the data by removing undefined/null values
          const cleanData = JSON.parse(JSON.stringify(orderData, (key, value) => {
            return value === undefined || value === null ? undefined : value;
          }));
          
          result = await realistoService.createOrder(cleanData);
          break;
          
        case "orders-list":
          // Remove action from filters
          const { action: __, ...filters } = body;
          result = await realistoService.getOrdersList(filters);
          break;
          
        case "cancel-order":
          if (!body.orderId) {
            return new Response(JSON.stringify({ error: "Order ID is required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          result = await realistoService.cancelOrder(body.orderId);
          break;
          
        case "refund-order":
          if (!body.orderId || !body.amount) {
            return new Response(JSON.stringify({ error: "Order ID and amount are required" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            });
          }
          result = await realistoService.refundOrder(body.orderId, body.amount);
          break;
          
        case "get-terminals":
          result = await realistoService.getTerminalList();
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
    } catch (error: any) {
      console.error("Operation failed:", error);
      return new Response(JSON.stringify({ 
        error: error.message,
        details: "Operation failed with the MOTO API"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error: any) {
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
