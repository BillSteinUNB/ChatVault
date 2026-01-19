import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactRequest {
  name: string
  email: string
  message: string
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
    // Parse request body
    const body: ContactRequest = await req.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    if (!EMAIL_REGEX.test(body.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate field lengths
    if (body.name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Name cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (body.name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Name is too long (maximum 100 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (body.message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (body.message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Message is too long (maximum 5000 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const supportEmail = Deno.env.get('SUPPORT_EMAIL') || 'support@chatvault.app'

    // Check if Resend API key is configured
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          message: 'The contact form is not properly configured. Please contact support directly.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email via Resend API
    const emailData = {
      from: 'ChatVault Contact Form <onboarding@resend.dev>',
      to: [supportEmail],
      subject: `Contact Form: ${body.name}`,
      reply_to: body.email,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #555; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-left: 3px solid #667eea; border-radius: 4px; }
              .message { white-space: pre-wrap; }
              .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${escapeHtml(body.name)}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">
                    <a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a>
                  </div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value message">${escapeHtml(body.message)}</div>
                </div>
              </div>
              <div class="footer">
                <p>This message was sent from the ChatVault contact form.</p>
                <p>Reply to this email to respond to ${escapeHtml(body.name)}.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text()
      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: 'Unable to send email at this time. Please try again later.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const responseData = await resendResponse.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully',
        id: responseData.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in contact function:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
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

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
