
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
    try {
      const token = await this.login();
      
      console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

      // Format the request body to match exactly what the API expects
      // Based on the PHP example, the API expects properties directly on the object
      const apiPayload = {
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
        customer: orderData.customer,
        ordersapidata: orderData.ordersapidata
      };

      // Make sure the mobile number is properly formatted in the customer object
      if (apiPayload.customer && apiPayload.customer.mobile) {
        // Remove any spaces from the phone number
        const phoneNumber = apiPayload.customer.mobile.replace(/\s+/g, '');
        
        // Ensure it starts with a + sign
        apiPayload.customer.mobile = phoneNumber.startsWith('+') 
          ? phoneNumber 
          : `+${phoneNumber}`;
          
        console.log("Formatted mobile number:", apiPayload.customer.mobile);
      }

      // Ensure URLs in ordersapidata are properly formatted
      if (apiPayload.ordersapidata) {
        const merchantOrderId = apiPayload.ordersapidata.merchant_order_id || `order-${Date.now()}`;
        
        // Set a default merchant_order_id if not provided
        if (!apiPayload.ordersapidata.merchant_order_id) {
          apiPayload.ordersapidata.merchant_order_id = merchantOrderId;
          console.log("Generated merchant_order_id:", merchantOrderId);
        }
        
        // Make sure okUrl and koUrl have the order ID parameter if needed
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
        // Check if we're using the new format with orderData
        if (body.orderData) {
          // Directly use the provided orderData in the new format
          console.log("Using provided orderData format:", JSON.stringify(body.orderData, null, 2));
          result = await service.createOrder(body.orderData);
        } else {
          // This structure is now deprecated but kept for backward compatibility
          if (!body.Orders?.amount) {
            throw new Error("Missing required field: Orders.amount");
          }
          
          if (!body.Customers?.client_name || !body.Customers?.mail) {
            throw new Error("Missing required customer information");
          }
          
          if (!body.OrdersApiData?.okUrl || !body.OrdersApiData?.koUrl) {
            throw new Error("Missing required URLs");
          }

          // Convert from our format to the API's expected format
          const apiOrderData = {
            terminal_id: body.Orders.terminal_id,
            amount: body.Orders.amount,
            lang: body.Orders.lang,
            skip_email: body.Orders.skip_email,
            is_recurring: body.Orders.is_recurring ? 1 : 0,
            repeat_count: body.Orders.repeat_count,
            repeat_time: body.Orders.repeat_time,
            repeat_period: body.Orders.repeat_period,
            is_auth: body.Orders.is_auth,
            merchant_order_description: body.Orders.merchant_order_description,
            customer: {
              client_name: body.Customers.client_name,
              mail: body.Customers.mail,
              mobile: body.Customers.mobile,
              tax_id: body.Customers.tax_id || '',
              country: body.Customers.country,
              city: body.Customers.city,
              state: body.Customers.state,
              zip: body.Customers.zip,
              address: body.Customers.address
            },
            ordersapidata: {
              incrementId: body.OrdersApiData.incrementId || body.OrdersApiData.merchant_order_id,
              okUrl: body.OrdersApiData.okUrl,
              koUrl: body.OrdersApiData.koUrl,
              merchant_order_id: body.OrdersApiData.merchant_order_id
            }
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

    // Ensure result contains a pay_url if it's a create-order action
    if (body.action === "create-order" && result) {
      // Add additional logging of the final result
      console.log("Final result to return to client:", JSON.stringify(result, null, 2));
      
      // Make sure the result has a properly formatted pay_url
      if (!result.pay_url && typeof result === 'string' && result.includes('http')) {
        result = { pay_url: result.trim() };
      }
      
      // If we have a URL in the wrong location, move it to the correct spot
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
    
    // Provide more detailed error for the frontend
    let errorMessage = error.message || "Operation failed with the Realisto API";
    let errorDetails = "Please check your API credentials and try again";
    
    // Handle specific errors
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
