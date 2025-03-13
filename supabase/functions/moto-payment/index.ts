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
      
      console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

      if (!orderData.Orders) {
        throw new Error("Missing required field: Orders");
      }
      
      if (!orderData.Customers) {
        throw new Error("Missing required field: Customers");
      }
      
      if (!orderData.OrdersApiData) {
        throw new Error("Missing required field: OrdersApiData");
      }

      const apiPayload = {
        terminal_id: orderData.Orders.terminal_id,
        amount: orderData.Orders.amount,
        lang: orderData.Orders.lang,
        skip_email: orderData.Orders.skip_email || 0,
        is_recurring: orderData.Orders.is_recurring || 0,
        repeat_count: orderData.Orders.repeat_count,
        repeat_time: orderData.Orders.repeat_time,
        repeat_period: orderData.Orders.repeat_period,
        is_auth: orderData.Orders.is_auth || 0,
        merchant_order_description: orderData.Orders.merchant_order_description,
        customer: orderData.Customers,
        ordersapidata: orderData.OrdersApiData
      };

      if (apiPayload.customer && apiPayload.customer.mobile) {
        const phoneNumber = apiPayload.customer.mobile.replace(/\s+/g, '');
        apiPayload.customer.mobile = phoneNumber.startsWith('+') 
          ? phoneNumber 
          : `+${phoneNumber}`;
          
        console.log("Formatted mobile number:", apiPayload.customer.mobile);
      }

      if (apiPayload.ordersapidata) {
        const merchantOrderId = apiPayload.ordersapidata.merchant_order_id || `order-${Date.now()}`;
        
        if (!apiPayload.ordersapidata.merchant_order_id) {
          apiPayload.ordersapidata.merchant_order_id = merchantOrderId;
          console.log("Generated merchant_order_id:", merchantOrderId);
        }
        
        if (apiPayload.ordersapidata.okUrl && !apiPayload.ordersapidata.okUrl.includes('?id=')) {
          apiPayload.ordersapidata.okUrl = `${apiPayload.ordersapidata.okUrl}?id=${merchantOrderId}`;
          console.log("Updated okUrl:", apiPayload.ordersapidata.okUrl);
        }
        
        if (apiPayload.ordersapidata.koUrl && !apiPayload.ordersapidata.koUrl.includes('?id=')) {
          apiPayload.ordersapidata.koUrl = `${apiPayload.ordersapidata.koUrl}?id=${merchantOrderId}`;
          console.log("Updated koUrl:", apiPayload.ordersapidata.koUrl);
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

    if (!body.action) {
      throw new Error("Missing action parameter");
    }

    let result;
    switch (body.action) {
      case "create-order":
        if (body.orderData) {
          console.log("Using provided orderData format:", JSON.stringify(body.orderData, null, 2));
          result = await service.createOrder(body.orderData);
        } else {
          if (!body.Orders?.amount) {
            throw new Error("Missing required field: Orders.amount");
          }
          
          if (!body.Customers?.client_name || !body.Customers?.mail) {
            throw new Error("Missing required customer information");
          }
          
          if (!body.OrdersApiData?.okUrl || !body.OrdersApiData?.koUrl) {
            throw new Error("Missing required URLs");
          }

          const apiOrderData = {
            Orders: body.Orders,
            Customers: body.Customers,
            OrdersApiData: body.OrdersApiData
          };
          
          console.log("Converted to API format:", JSON.stringify(apiOrderData, null, 2));
          result = await service.createOrder(apiOrderData);
        }
        break;

      case "orders-list":
      case "get-terminals":
      case "cancel-order":
      case "refund-order":
        throw new Error(`${body.action} not implemented yet`);

      default:
        throw new Error("Invalid action");
    }

    if (body.action === "create-order" && result) {
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
