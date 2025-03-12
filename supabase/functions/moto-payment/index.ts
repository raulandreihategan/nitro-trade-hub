
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
      
      // Log key and secret format (not values) for debugging
      console.log(`API Key format: ${this.apiKey ? `${this.apiKey.substring(0, 3)}...${this.apiKey.substring(this.apiKey.length - 3)}` : 'undefined'}`);
      console.log(`API Secret format: ${this.apiSecret ? `${this.apiSecret.substring(0, 3)}...${this.apiSecret.substring(this.apiSecret.length - 3)}` : 'undefined'}`);
      
      // Check API key format - Realisto API keys typically start with "OMT"
      if (!this.apiKey || !this.apiKey.startsWith("OMT")) {
        throw new Error("Invalid API key format. API key should start with 'OMT'");
      }
      
      // Check API secret format - Realisto API secrets typically start with "RLC"
      if (!this.apiSecret || !this.apiSecret.startsWith("RLC")) {
        throw new Error("Invalid API secret format. API secret should start with 'RLC'");
      }
      
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
      // Create a new customer data object
      const newCustomerData = { ...orderData.Customers };
      
      // Remove mobile from customer data to avoid duplication
      delete newCustomerData.mobile;
      
      // Check if we have a phone number and format it correctly
      if (orderData.Customers && orderData.Customers.mobile) {
        // Make sure the phone number is in the right format
        let phoneNumber = orderData.Customers.mobile.replace(/\s+/g, '');
        
        // If it doesn't start with +, add it
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = `+${phoneNumber}`;
        }
            
        // Explicitly add phoneNumber as a separate field in the expected format
        newCustomerData.phoneNumber = phoneNumber;
        
        console.log("Mapped mobile to phoneNumber:", phoneNumber);
      }
      
      // Replace the customer data with our new object
      orderData.Customers = newCustomerData;

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
    // Get API credentials from environment variables
    const REALISTO_API_KEY = Deno.env.get("MOTO_API_KEY");
    const REALISTO_API_SECRET = Deno.env.get("MOTO_API_SECRET");
    
    if (!REALISTO_API_KEY || !REALISTO_API_SECRET) {
      console.error("Missing credentials:", { apiKey: !!REALISTO_API_KEY, apiSecret: !!REALISTO_API_SECRET });
      throw new Error("Missing Realisto API credentials. Make sure MOTO_API_KEY and MOTO_API_SECRET are set in the Supabase secrets.");
    }

    // Validate API key format
    if (!REALISTO_API_KEY.startsWith("OMT")) {
      console.error("API Key format:", REALISTO_API_KEY.substring(0, 3) + "...");
      throw new Error("Invalid API key format. API key should start with 'OMT'");
    }
    
    // Validate API secret format
    if (!REALISTO_API_SECRET.startsWith("RLC")) {
      console.error("API Secret format:", REALISTO_API_SECRET.substring(0, 3) + "...");
      throw new Error("Invalid API secret format. API secret should start with 'RLC'");
    }

    console.log("API credentials loaded successfully");
    console.log("API Key format:", REALISTO_API_KEY.substring(0, 3) + "...");
    console.log("API Secret format:", REALISTO_API_SECRET.substring(0, 3) + "...");
    
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
    
    // Provide more detailed error for the frontend
    let errorMessage = error.message || "Operation failed with the Realisto API";
    let errorDetails = "Please check your API credentials and try again";
    
    // Handle specific errors
    if (errorMessage.includes("Invalid API key format") || errorMessage.includes("Invalid API secret format")) {
      errorDetails = "Please ensure your API keys are in the correct format.";
    } else if (errorMessage.includes("Login failed")) {
      errorDetails = "Authentication failed. Please check your API credentials.";
    } else if (errorMessage.includes("phoneNumber")) {
      errorDetails = "Please provide a valid phone number in international format (+XXXXXXXXXXX).";
    }
    
    return new Response(JSON.stringify({
      error: errorMessage,
      details: errorDetails
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
