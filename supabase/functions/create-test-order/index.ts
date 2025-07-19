import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating weekly test order...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create a test order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null, // No user for automated test orders
        total_amount: 99.99,
        status: 'completed',
        payment_intent_id: `test_${Date.now()}`
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Test order created:', order.id);

    // Create test order items
    const testItems = [
      {
        order_id: order.id,
        service_id: 'test_service_1',
        service_title: 'Test Gaming Service',
        option_id: 'test_option_1',
        option_name: 'Premium Package',
        price: 59.99
      },
      {
        order_id: order.id,
        service_id: 'test_service_2',
        service_title: 'Test Boost Service',
        option_id: 'test_option_2',
        option_name: 'Standard Package',
        price: 39.99
      }
    ];

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(testItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    console.log('Test order items created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        message: 'Weekly test order created successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in create-test-order function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});