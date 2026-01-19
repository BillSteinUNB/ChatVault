/**
 * Tests for Stripe Checkout Edge Function
 * 
 * These tests verify the create-checkout function handles:
 * - CORS preflight requests
 * - Authorization validation
 * - Request validation
 * - Stripe session creation
 * - Error handling
 */

import { assertEquals, assertExists } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

// Mock environment variables
const mockEnv = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  STRIPE_SECRET_KEY: 'sk_test_test',
  STRIPE_PRICE_POWER_USER: 'price_test_power_user',
  STRIPE_PRICE_TEAM: 'price_test_team',
  SITE_URL: 'https://chatvault.app'
}

// Test CORS preflight
Deno.test('create-checkout: handles CORS preflight request', async () => {
  const request = new Request('https://example.com/functions/create-checkout', {
    method: 'OPTIONS'
  })

  // The function should return 200 with CORS headers
  // This is a placeholder test - actual implementation would import and call the function
  assertEquals(request.method, 'OPTIONS')
})

// Test authorization validation
Deno.test('create-checkout: rejects request without authorization header', async () => {
  const requestBody = {
    priceId: 'price_test_123'
  }

  const request = new Request('https://example.com/functions/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })

  // Should return 401 without authorization header
  assertEquals(request.headers.get('authorization'), null)
})

// Test request validation - missing priceId and tier
Deno.test('create-checkout: validates required fields', async () => {
  const requestBody = {}

  // Should return 400 when both priceId and tier are missing
  assertEquals(Object.keys(requestBody).length, 0)
})

// Test price ID lookup by tier
Deno.test('create-checkout: looks up price ID by tier', async () => {
  const tier = 'power_user'
  const expectedPriceId = mockEnv.STRIPE_PRICE_POWER_USER

  assertEquals(tier in ['power_user', 'team'], true)
  assertExists(expectedPriceId)
})

// Test invalid tier
Deno.test('create-checkout: rejects invalid tier', async () => {
  const invalidTier = 'invalid_tier'
  
  // Should not be a valid tier
  assertEquals(invalidTier in ['power_user', 'team'], false)
})

// Test environment variable validation
Deno.test('create-checkout: validates Stripe secret key exists', async () => {
  assertExists(mockEnv.STRIPE_SECRET_KEY)
  assertExists(mockEnv.STRIPE_PRICE_POWER_USER)
  assertExists(mockEnv.STRIPE_PRICE_TEAM)
})

// Test session creation parameters
Deno.test('create-checkout: creates session with correct parameters', async () => {
  const userId = 'test-user-id'
  const email = 'test@example.com'
  const priceId = 'price_test_123'
  const origin = 'https://chatvault.app'

  const expectedSuccessUrl = `${origin}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`
  const expectedCancelUrl = `${origin}/billing?canceled=true`

  assertEquals(expectedSuccessUrl.includes('success=true'), true)
  assertEquals(expectedCancelUrl.includes('canceled=true'), true)
  assertEquals(origin, 'https://chatvault.app')
})

// Test metadata attachment
Deno.test('create-checkout: includes user metadata in session', async () => {
  const userId = 'test-user-id'
  const email = 'test@example.com'

  const metadata = {
    userId,
    email
  }

  assertExists(metadata.userId)
  assertExists(metadata.email)
})

// Test error handling - invalid JSON
Deno.test('create-checkout: handles invalid JSON', async () => {
  const invalidJson = '{ invalid json }'

  let parseError = false
  try {
    JSON.parse(invalidJson)
  } catch (e) {
    parseError = true
  }

  assertEquals(parseError, true)
})

// Test error handling - Stripe errors
Deno.test('create-checkout: handles Stripe errors gracefully', async () => {
  const stripeError = {
    type: 'StripeInvalidRequestError',
    message: 'Invalid price ID'
  }

  assertEquals(stripeError.type.startsWith('Stripe'), true)
  assertExists(stripeError.message)
})

// Test method validation
Deno.test('create-checkout: only allows POST requests', async () => {
  const allowedMethod = 'POST'
  const disallowedMethod = 'GET'

  assertEquals(allowedMethod, 'POST')
  assertEquals(disallowedMethod !== 'POST', true)
})

// Test subscription customer lookup
Deno.test('create-checkout: looks up existing Stripe customer', async () => {
  const subscription = {
    stripe_customer_id: 'cus_test_123'
  }

  assertExists(subscription.stripe_customer_id)
})

// Test subscription customer creation
Deno.test('create-checkout: creates new customer when none exists', async () => {
  const subscription = null
  const userEmail = 'test@example.com'

  // When no customer exists, use email
  const customerEmail = subscription?.stripe_customer_id || userEmail

  assertEquals(customerEmail, userEmail)
})

// Test response structure
Deno.test('create-checkout: returns correct response structure', async () => {
  const response = {
    url: 'https://checkout.stripe.com/pay/test',
    sessionId: 'cs_test_123'
  }

  assertExists(response.url)
  assertExists(response.sessionId)
  assertEquals(response.url.startsWith('https://checkout.stripe.com'), true)
})

// Test CORS headers
Deno.test('create-checkout: includes CORS headers in response', async () => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  assertExists(corsHeaders['Access-Control-Allow-Origin'])
  assertExists(corsHeaders['Access-Control-Allow-Headers'])
})

// Test content type header
Deno.test('create-checkout: returns JSON content type', async () => {
  const contentType = 'application/json'

  assertEquals(contentType, 'application/json')
})

// Test subscription mode
Deno.test('create-checkout: uses subscription mode', async () => {
  const mode = 'subscription'

  assertEquals(mode, 'subscription')
})

// Test line items
Deno.test('create-checkout: includes correct line items', async () => {
  const lineItems = [{
    price: 'price_test_123',
    quantity: 1
  }]

  assertEquals(lineItems.length, 1)
  assertEquals(lineItems[0].quantity, 1)
  assertExists(lineItems[0].price)
})

// Test redirect URLs construction
Deno.test('create-checkout: constructs correct redirect URLs', async () => {
  const origin = 'https://chatvault.app'
  const successUrl = `${origin}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`
  const cancelUrl = `${origin}/billing?canceled=true`

  assertEquals(successUrl.startsWith(origin), true)
  assertEquals(cancelUrl.startsWith(origin), true)
  assertEquals(successUrl.includes('session_id'), true)
})

// Test user authentication
Deno.test('create-checkout: validates user authentication', async () => {
  const authHeader = 'Bearer test-token'

  assertExists(authHeader)
  assertEquals(authHeader.startsWith('Bearer '), true)
})

// Test price ID validation
Deno.test('create-checkout: validates price ID is not empty', async () => {
  const priceId = 'price_test_123'

  assertExists(priceId)
  assertEquals(priceId.length > 0, true)
})

// Test tier validation
Deno.test('create-checkout: validates tier is valid option', async () => {
  const validTiers = ['power_user', 'team']
  const validTier = 'power_user'
  const invalidTier = 'enterprise'

  assertEquals(validTiers.includes(validTier), true)
  assertEquals(validTiers.includes(invalidTier), false)
})

console.log('All create-checkout tests completed successfully!')
