import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

// Tier price ID mapping (must match create-checkout function)
const TIER_PRICE_IDS: { [key: string]: string } = {
  power_user: Deno.env.get('STRIPE_PRICE_POWER_USER') || '',
  team: Deno.env.get('STRIPE_PRICE_TEAM') || '',
}

// Helper function to determine tier from price ID
function getTierFromPriceId(priceId: string): string | null {
  for (const [tier, tierPriceId] of Object.entries(TIER_PRICE_IDS)) {
    if (priceId === tierPriceId) {
      return tier
    }
  }
  return null
}

// Helper function to map Stripe subscription status to our status
function mapSubscriptionStatus(stripeStatus: string): string {
  const statusMap: { [key: string]: string } = {
    'active': 'active',
    'trialing': 'active',
    'past_due': 'past_due',
    'canceled': 'canceled',
    'unpaid': 'unpaid',
    'incomplete': 'active',
    'incomplete_expired': 'canceled',
  }
  return statusMap[stripeStatus] || 'active'
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Get Stripe webhook secret
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Webhook not configured',
          message: 'Stripe webhook secret is not configured'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Stripe secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Stripe not configured',
          message: 'Stripe secret key is not configured'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get signature from headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get raw body
    const body = await req.text()

    // Import Stripe
    const stripe = await import('https://esm.sh/stripe@14.21.0')
    const stripeClient = new stripe.default(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    })

    // Verify webhook signature
    let event: stripe.Event
    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing webhook event: ${event.type}`)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as stripe.Checkout.Session
        
        // Get metadata from session
        const userId = session.metadata?.userId
        const email = session.metadata?.email
        
        if (!userId) {
          console.error('checkout.session.completed: Missing userId in metadata')
          return new Response(
            JSON.stringify({ error: 'Missing userId in session metadata' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get subscription details from Stripe
        if (session.subscription) {
          const subscription = await stripeClient.subscriptions.retrieve(
            session.subscription as string
          )

          // Determine tier from subscription items
          const priceId = subscription.items.data[0]?.price.id
          const tier = getTierFromPriceId(priceId)

          if (!tier) {
            console.error(`checkout.session.completed: Unknown price ID: ${priceId}`)
            return new Response(
              JSON.stringify({ error: 'Unknown price ID', priceId }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Update or create subscription record
          const { error: upsertError } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              tier: tier,
              status: mapSubscriptionStatus(subscription.status),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'user_id'
            })

          if (upsertError) {
            console.error('checkout.session.completed: Failed to upsert subscription:', upsertError)
            return new Response(
              JSON.stringify({ error: 'Failed to create subscription', details: upsertError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          console.log(`checkout.session.completed: Created/updated subscription for user ${userId}, tier: ${tier}`)
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as stripe.Subscription

        // Find user by stripe_subscription_id
        const { data: existingSub, error: fetchError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (fetchError || !existingSub) {
          console.error(`customer.subscription.updated: Subscription ${subscription.id} not found`)
          return new Response(
            JSON.stringify({ error: 'Subscription not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Determine tier from subscription items
        const priceId = subscription.items.data[0]?.price.id
        const tier = getTierFromPriceId(priceId)

        if (!tier) {
          console.error(`customer.subscription.updated: Unknown price ID: ${priceId}`)
          // Don't fail the webhook, just log and keep existing tier
          console.warn('Keeping existing tier for subscription')
        }

        // Update subscription record
        const updateData: any = {
          status: mapSubscriptionStatus(subscription.status),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Only update tier if we could determine it
        if (tier) {
          updateData.tier = tier
        }

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update(updateData)
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('customer.subscription.updated: Failed to update subscription:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to update subscription', details: updateError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`customer.subscription.updated: Updated subscription for user ${existingSub.user_id}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as stripe.Subscription

        // Find user by stripe_subscription_id
        const { data: existingSub, error: fetchError } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (fetchError || !existingSub) {
          console.error(`customer.subscription.deleted: Subscription ${subscription.id} not found`)
          return new Response(
            JSON.stringify({ error: 'Subscription not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Downgrade to free tier (hobbyist)
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            tier: 'hobbyist',
            status: 'canceled',
            stripe_subscription_id: null,
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (updateError) {
          console.error('customer.subscription.deleted: Failed to downgrade subscription:', updateError)
          return new Response(
            JSON.stringify({ error: 'Failed to downgrade subscription', details: updateError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        console.log(`customer.subscription.deleted: Downgraded user ${existingSub.user_id} to hobbyist tier`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as stripe.Invoice
        
        if (invoice.subscription) {
          // Update subscription status to past_due
          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription as string)

          if (updateError) {
            console.error('invoice.payment_failed: Failed to update subscription:', updateError)
            // Don't fail the webhook, just log
          } else {
            console.log(`invoice.payment_failed: Marked subscription ${invoice.subscription} as past_due`)
          }
        }

        break
      }

      default:
        console.log(`Unhandled webhook event type: ${event.type}`)
    }

    // Return success response
    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in stripe-webhook function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
