import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Price IDs for different tiers (replace with actual Stripe Price IDs)
const PRICE_IDS = {
  power_user: Deno.env.get('STRIPE_PRICE_POWER_USER') || '',
  team: Deno.env.get('STRIPE_PRICE_TEAM') || '',
}

interface CheckoutRequest {
  priceId: string
  tier: 'power_user' | 'team'
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
    // Get authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { authorization: authHeader }
      }
    })

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: CheckoutRequest = await req.json()

    // Validate required fields
    if (!body.priceId && !body.tier) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: priceId or tier is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Determine price ID
    let priceId = body.priceId
    if (body.tier) {
      priceId = PRICE_IDS[body.tier]
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: `No price ID configured for tier: ${body.tier}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Invalid price ID' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Stripe secret key
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Payment service not configured',
          message: 'Stripe is not properly configured. Please contact support.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    // If no customer exists, we'll let Stripe create one using the email
    const customerEmail = user.email

    // Get origin for redirect URLs
    const origin = req.headers.get('origin') || Deno.env.get('SITE_URL') || 'https://chatvault.app'

    // Create Stripe checkout session
    const stripe = await import('https://esm.sh/stripe@14.21.0')

    const stripeClient = new stripe.default(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    })

    const session = await stripeClient.checkout.sessions.create({
      customer: customerId || undefined,
      customer_email: customerEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: { 
        userId: user.id,
        email: user.email
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          email: user.email
        }
      }
    })

    // Return checkout URL
    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in create-checkout function:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle Stripe-specific errors
    if (error.type && error.type.startsWith('Stripe')) {
      return new Response(
        JSON.stringify({ 
          error: 'Stripe error',
          details: error.message
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
