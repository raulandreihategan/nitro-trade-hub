
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
    
    if (this.authToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      console.log("Using cached auth token");
      return this.authToken;
    }

    try {
      console.log("Making login request with API key/secret");
      
      console.log(`API Key format: ${this.apiKey ? `${this.apiKey.substring(0, 3)}...${this.apiKey.substring(this.apiKey.length - 3)}` : 'undefined'}`);
      console.log(`API Secret format: ${this.apiSecret ? `${this.apiSecret.substring(0, 3)}...${this.apiSecret.substring(this.apiSecret.length - 3)}` : 'undefined'}`);
      
      if (!this.apiKey || !this.apiKey.startsWith("OMT")) {
        throw new Error("Invalid API key format. API key should start with 'OMT'");
      }
      
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

      this.authToken = data.access_token || data.token;
      this.tokenExpiry = Date.now() + (9.5 * 60 * 1000);
      
      console.log("Successfully obtained access token");
      return this.authToken;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
  }

  async createOrder(orderData: any): Promise<any> {
    try {
      const token = await this.login();
      
      // Log the original data we received from the client
      console.log("Creating order with original data:", JSON.stringify(orderData, null, 2));

      // Create a proper Orders object exactly like in the PHP example
      // This is key to fixing the "Undefined index: Orders" error
      const apiPayload: any = {
        Orders: {
          terminal_id: orderData.terminal_id,
          amount: orderData.amount,
          lang: orderData.lang,
          skip_email: orderData.skip_email || 0,
          is_recurring: orderData.is_recurring || 0,
          repeat_count: orderData.repeat_count,
          repeat_time: orderData.repeat_time,
          repeat_period: orderData.repeat_period,
          is_auth: orderData.is_auth || 0,
          merchant_order_description: orderData.merchant_order_description,
        },
        Customers: orderData.customer,
        OrdersApiData: orderData.ordersapidata
      };

      // Format mobile phone number if present
      if (apiPayload.Customers && apiPayload.Customers.mobile) {
        const phoneNumber = apiPayload.Customers.mobile.replace(/\s+/g, '');
        apiPayload.Customers.mobile = phoneNumber.startsWith('+') 
          ? phoneNumber 
          : `+${phoneNumber}`;
          
        console.log("Formatted mobile number:", apiPayload.Customers.mobile);
      }

      // Ensure merchant_order_id is set and URLs include the ID
      if (apiPayload.OrdersApiData) {
        const merchantOrderId = apiPayload.OrdersApiData.merchant_order_id || `order-${Date.now()}`;
        
        if (!apiPayload.OrdersApiData.merchant_order_id) {
          apiPayload.OrdersApiData.merchant_order_id = merchantOrderId;
          console.log("Generated merchant_order_id:", merchantOrderId);
        }
        
        if (apiPayload.OrdersApiData.okUrl && !apiPayload.OrdersApiData.okUrl.includes('?id=')) {
          apiPayload.OrdersApiData.okUrl = `${apiPayload.OrdersApiData.okUrl}?id=${merchantOrderId}`;
          console.log("Updated okUrl:", apiPayload.OrdersApiData.okUrl);
        }
        
        if (apiPayload.OrdersApiData.koUrl && !apiPayload.OrdersApiData.koUrl.includes('?id=')) {
          apiPayload.OrdersApiData.koUrl = `${apiPayload.OrdersApiData.koUrl}?id=${merchantOrderId}`;
          console.log("Updated koUrl:", apiPayload.OrdersApiData.koUrl);
        }
      }

      console.log("Making request to API with prepared data:", JSON.stringify(apiPayload, null, 2));

      const response = await fetch(`${this.baseUrl}/orders/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
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
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200
    });
  }

  try {
    const REALISTO_API_KEY = Deno.env.get("MOTO_API_KEY");
    const REALISTO_API_SECRET = Deno.env.get("MOTO_API_SECRET");
    
    if (!REALISTO_API_KEY || !REALISTO_API_SECRET) {
      console.error("Missing credentials:", { apiKey: !!REALISTO_API_KEY, apiSecret: !!REALISTO_API_SECRET });
      throw new Error("Missing Realisto API credentials. Make sure MOTO_API_KEY and MOTO_API_SECRET are set in the Supabase secrets.");
    }

    if (!REALISTO_API_KEY.startsWith("OMT")) {
      console.error("API Key format:", REALISTO_API_KEY.substring(0, 3) + "...");
      throw new Error("Invalid API key format. API key should start with 'OMT'");
    }
    
    if (!REALISTO_API_SECRET.startsWith("RLC")) {
      console.error("API Secret format:", REALISTO_API_SECRET.substring(0, 3) + "...");
      throw new Error("Invalid API secret format. API secret should start with 'RLC'");
    }

    console.log("API credentials loaded successfully");
    console.log("API Key format:", REALISTO_API_KEY.substring(0, 3) + "...");
    console.log("API Secret format:", REALISTO_API_SECRET.substring(0, 3) + "...");

    const service = new RealistoService(REALISTO_API_KEY, REALISTO_API_SECRET);

    const body = await req.json();
    console.log("Received request:", JSON.stringify(body, null, 2));

    let result;
    
    // Handle direct order creation (when terminal_id, amount, etc. are top-level)
    if (body.terminal_id && body.amount && body.customer) {
      console.log("Using direct order format");
      result = await service.createOrder(body);
    }
    // Handle create-order action with orderData
    else if (body.action === "create-order") {
      console.log("Using action-based order format");
      if (body.orderData) {
        result = await service.createOrder(body.orderData);
      } else {
        throw new Error("Missing orderData in create-order request");
      }
    }
    // Handle other actions like orders-list, etc.
    else if (body.action) {
      if (body.action === "orders-list" || 
          body.action === "get-terminals" || 
          body.action === "cancel-order" || 
          body.action === "refund-order") {
        throw new Error(`${body.action} not implemented yet`);
      } else {
        throw new Error("Invalid action");
      }
    }
    // Handle any other case as an error
    else {
      throw new Error("Invalid request format. Missing required fields.");
    }
    
    if (result) {
      console.log("Final result to return to client:", JSON.stringify(result, null, 2));
      
      if (!result.pay_url && typeof result === 'string' && result.includes('http')) {
        result = { pay_url: result.trim() };
      }
      
      if (!result.pay_url && result.body && result.body.pay_url) {
        result.pay_url = result.body.pay_url;
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error: any) {
    console.error("Operation failed:", error);
    
    let errorMessage = error.message || "Operation failed with the Realisto API";
    let errorDetails = "Please check your API credentials and try again";
    
    if (errorMessage.includes("Invalid API key format") || errorMessage.includes("Invalid API secret format")) {
      errorDetails = "Please ensure your API keys are in the correct format.";
    } else if (errorMessage.includes("Login failed")) {
      errorDetails = "Authentication failed. Please check your API credentials.";
    } else if (errorMessage.includes("mobile")) {
      errorDetails = "Please provide a valid phone number in international format (+XXXXXXXXXXX).";
    } else if (errorMessage.includes("Undefined index")) {
      errorMessage = "API request format error: " + errorMessage;
      errorDetails = "The request structure doesn't match what the API expects. Please check the format.";
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
