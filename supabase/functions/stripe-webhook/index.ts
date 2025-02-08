
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No Stripe signature found in webhook request');
      return new Response('No signature', { 
        status: 400,
        headers: corsHeaders
      });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      return new Response(`Webhook Error: ${err.message}`, { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('Processing webhook event:', event.type, 'Event ID:', event.id);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        try {
          // First try to get subscription from session
          let subscription;
          if (session.subscription) {
            console.log('Retrieving subscription from session:', session.subscription);
            subscription = await stripe.subscriptions.retrieve(session.subscription);
          } else {
            // If no subscription in session, search by customer
            console.log('Searching for subscription by customer:', session.customer);
            const subscriptions = await stripe.subscriptions.list({
              customer: session.customer,
              limit: 1,
              status: 'active',
            });
            
            if (subscriptions.data.length > 0) {
              subscription = subscriptions.data[0];
              console.log('Found subscription:', subscription.id);
            } else {
              throw new Error('No subscription found for customer');
            }
          }
          
          // Update subscription record
          const { error: updateError } = await supabaseClient
            .from('subscriptions')
            .update({
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', session.customer);

          if (updateError) {
            console.error('Error updating subscription in database:', updateError);
            throw updateError;
          }

          console.log('Successfully updated subscription record');
        } catch (error) {
          console.error('Error processing checkout.session.completed:', error);
          throw error;
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log(`Subscription ${event.type}:`, subscription.id);
        
        try {
          const { error: updateError } = await supabaseClient
            .from('subscriptions')
            .update({
              status: subscription.status,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

          if (updateError) {
            console.error('Error updating subscription status:', updateError);
            throw updateError;
          }

          console.log('Successfully updated subscription status');
        } catch (error) {
          console.error(`Error processing ${event.type}:`, error);
          throw error;
        }
        break;
      }
    }

    // Send success response with CORS headers
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
