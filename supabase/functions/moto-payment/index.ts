
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
      
      this.validateCredentials();
      
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
      
      console.log("Login response data:", JSON.stringify(data, null, 2));

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
  
  private validateCredentials() {
    if (!this.apiKey || !this.apiKey.startsWith("OMT")) {
      throw new Error("Invalid API key format. API key should start with 'OMT'");
    }
    
    if (!this.apiSecret || !this.apiSecret.startsWith("RLC")) {
      throw new Error("Invalid API secret format. API secret should start with 'RLC'");
    }
  }
  
  private validateOrderData(orderData: any) {
    if (!orderData.Orders) {
      throw new Error("Missing Orders object in request");
    }
    
    if (!orderData.Customers) {
      throw new Error("Missing Customers object in request");
    }
    
    if (!orderData.OrdersApiData) {
      throw new Error("Missing OrdersApiData object in request");
    }
  }
  
  private formatOrderData(orderData: any) {
    // Format mobile phone number if present
    if (orderData.Customers && orderData.Customers.mobile) {
      const phoneNumber = orderData.Customers.mobile.replace(/\s+/g, '');
      orderData.Customers.mobile = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+${phoneNumber}`;
          
      console.log("Formatted mobile number:", orderData.Customers.mobile);
    }
    
    // Validate country format if present
    if (orderData.Customers && orderData.Customers.country) {
      const country = orderData.Customers.country.trim();
      if (!/^[A-Z]{2}$/.test(country)) {
        console.warn(`Country format might be invalid: ${country}. The API expects 2-letter ISO country codes.`);
      }
    }

    // Always ensure terminal_id is 1439
    if (orderData.Orders) {
      orderData.Orders.terminal_id = 1439;
      console.log("Set terminal_id to 1439");
      
      // Convert lang to string if it's a number
      if (typeof orderData.Orders.lang === 'number') {
        orderData.Orders.lang = String(orderData.Orders.lang);
        console.log("Converted lang to string:", orderData.Orders.lang);
      }
    }

    // Ensure merchant_order_id is set and URLs include the ID
    if (orderData.OrdersApiData) {
      const merchantOrderId = orderData.OrdersApiData.merchant_order_id || `order-${Date.now()}`;
      
      if (!orderData.OrdersApiData.merchant_order_id) {
        orderData.OrdersApiData.merchant_order_id = merchantOrderId;
        console.log("Generated merchant_order_id:", merchantOrderId);
      }
      
      if (orderData.OrdersApiData.okUrl && !orderData.OrdersApiData.okUrl.includes('?id=')) {
        orderData.OrdersApiData.okUrl = `${orderData.OrdersApiData.okUrl}?id=${merchantOrderId}`;
        console.log("Updated okUrl:", orderData.OrdersApiData.okUrl);
      }
      
      if (orderData.OrdersApiData.koUrl && !orderData.OrdersApiData.koUrl.includes('?id=')) {
        orderData.OrdersApiData.koUrl = `${orderData.OrdersApiData.koUrl}?id=${merchantOrderId}`;
        console.log("Updated koUrl:", orderData.OrdersApiData.koUrl);
      }
    }
    
    return orderData;
  }

  async createOrder(orderData: any): Promise<any> {
    try {
      const token = await this.login();
      
      // Log the original data we received from the client
      console.log("Creating order with original data:", JSON.stringify(orderData, null, 2));

      // Ensure we have the exact structure expected by the PHP code
      this.validateOrderData(orderData);

      // Format the order data as needed
      const formattedOrderData = this.formatOrderData(orderData);

      // IMPORTANT: Remove the action field before sending to the API
      // The PHP example doesn't include an action field
      const apiOrderData = { ...formattedOrderData };
      if (apiOrderData.action) {
        delete apiOrderData.action;
        console.log("Removed 'action' field from order data");
      }

      console.log("Final payload being sent to Realisto API:", JSON.stringify(apiOrderData, null, 2));

      const response = await fetch(`${this.baseUrl}/orders/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiOrderData),
      });

      console.log("Create order response status:", response.status);
      
      const responseText = await response.text();
      console.log("API Response raw text:", responseText);

      if (!response.ok) {
        throw new Error(`Failed to create order: ${responseText}`);
      }

      return this.parseResponse(responseText);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
  
  private parseResponse(responseText: string) {
    try {
      const data = JSON.parse(responseText);
      console.log("Parsed response data:", JSON.stringify(data, null, 2));
      
      // Ensure we have a pay_url property at the top level
      if (data.body && data.body.pay_url && !data.pay_url) {
        data.pay_url = data.body.pay_url;
      }
      
      return data;
    } catch (e) {
      console.log("Response was not JSON, checking if it's a direct URL");
      if (responseText.trim().startsWith('http')) {
        return { pay_url: responseText.trim() };
      }
      throw new Error(`Invalid JSON response: ${responseText}`);
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
    
    validateEnvironment(REALISTO_API_KEY, REALISTO_API_SECRET);

    const service = new RealistoService(REALISTO_API_KEY!, REALISTO_API_SECRET!);

    const body = await req.json();
    console.log("Received request:", JSON.stringify(body, null, 2));

    let result = await processRequest(body, service);
    
    if (result) {
      result = formatResult(result);
      console.log("Final formatted result:", JSON.stringify(result, null, 2));
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error: any) {
    console.error("Operation failed:", error);
    return createErrorResponse(error, corsHeaders);
  }
});

// Helper functions for the edge function
function validateEnvironment(apiKey?: string, apiSecret?: string) {
  if (!apiKey || !apiSecret) {
    console.error("Missing credentials:", { apiKey: !!apiKey, apiSecret: !!apiSecret });
    throw new Error("Missing Realisto API credentials. Make sure MOTO_API_KEY and MOTO_API_SECRET are set in the Supabase secrets.");
  }

  if (!apiKey.startsWith("OMT")) {
    console.error("API Key format:", apiKey.substring(0, 3) + "...");
    throw new Error("Invalid API key format. API key should start with 'OMT'");
  }
  
  if (!apiSecret.startsWith("RLC")) {
    console.error("API Secret format:", apiSecret.substring(0, 3) + "...");
    throw new Error("Invalid API secret format. API secret should start with 'RLC'");
  }

  console.log("API credentials loaded successfully");
  console.log("API Key format:", apiKey.substring(0, 3) + "...");
  console.log("API Secret format:", apiSecret.substring(0, 3) + "...");
}

async function processRequest(body: any, service: RealistoService) {
  if (body.action === "create-order") {
    console.log("Processing create-order action");
    
    if (!body.Orders || !body.Customers || !body.OrdersApiData) {
      console.error("Invalid order data structure:", body);
      throw new Error("Invalid order data structure. Missing required objects.");
    }
    
    // Pass the properly structured data - IMPORTANT: Remove the action field
    const orderData = { ...body };
    delete orderData.action; // Remove the action field before sending to the API
    return await service.createOrder(orderData);
  }
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
  else {
    throw new Error("Invalid request format. Missing required fields.");
  }
}

function formatResult(result: any) {
  console.log("Formatting result:", JSON.stringify(result, null, 2));
  
  // Handle direct URL string responses
  if (typeof result === 'string' && result.includes('http')) {
    return { pay_url: result.trim() };
  }
  
  // Ensure we have a pay_url at the top level
  if (!result.pay_url) {
    if (result.body && result.body.pay_url) {
      result.pay_url = result.body.pay_url;
    } else if (typeof result === 'object') {
      // Search for a URL in any property
      for (const key in result) {
        if (typeof result[key] === 'string' && result[key].includes('http')) {
          result.pay_url = result[key];
          break;
        } else if (typeof result[key] === 'object' && result[key]) {
          for (const subKey in result[key]) {
            if (typeof result[key][subKey] === 'string' && 
                result[key][subKey].includes('http')) {
              result.pay_url = result[key][subKey];
              break;
            }
          }
          if (result.pay_url) break;
        }
      }
    }
  }
  
  console.log("Final formatted result:", JSON.stringify(result, null, 2));
  return result;
}

function createErrorResponse(error: any, corsHeaders: Record<string, string>) {
  let errorMessage = error.message || "Operation failed with the Realisto API";
  let errorDetails = "Please check your API credentials and try again";
  
  if (errorMessage.includes("Invalid API key format") || errorMessage.includes("Invalid API secret format")) {
    errorDetails = "Please ensure your API keys are in the correct format.";
  } else if (errorMessage.includes("Login failed")) {
    errorDetails = "Authentication failed. Please check your API credentials.";
  } else if (errorMessage.includes("mobile")) {
    errorDetails = "Please provide a valid phone number in international format (+XXXXXXXXXXX).";
  } else if (errorMessage.includes("country")) {
    errorDetails = "The country format is invalid. Please use a 2-letter ISO country code (e.g., GB for United Kingdom).";
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
