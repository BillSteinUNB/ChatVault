# Contact Edge Function

This function handles contact form submissions from the ChatVault web app.

## Configuration

### Required Environment Variables

Set these in your Supabase project dashboard (Settings → Environment Variables):

- `RESEND_API_KEY`: Your Resend API key for sending emails
- `SUPPORT_EMAIL` (optional): Destination email for contact form submissions (defaults to `support@chatvault.app`)

### Getting a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Add the key to your Supabase environment variables

## Deployment

Deploy the function to Supabase:

```bash
supabase functions deploy contact
```

## API Usage

### Endpoint

```
POST https://your-project.supabase.co/functions/v1/contact
```

### Request Headers

```
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

### Field Validation

- `name`: Required, 1-100 characters
- `email`: Required, must be valid email format
- `message`: Required, 1-5000 characters

### Response (Success)

```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "email-id-from-resend"
}
```

### Response (Validation Error)

```json
{
  "error": "Missing required fields: name, email, and message are required"
}
```

### Response (Email Service Error)

```json
{
  "error": "Email service not configured",
  "message": "The contact form is not properly configured. Please contact support directly."
}
```

## Testing

### Manual Testing with curl

```bash
curl -X POST https://your-project.supabase.co/functions/v1/contact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

### Test Cases

The function includes comprehensive validation for:

1. **Required Fields**: All three fields (name, email, message) must be present
2. **Email Format**: Validates using regex pattern
3. **Name Length**: 1-100 characters (non-empty after trimming)
4. **Message Length**: 1-5000 characters (non-empty after trimming)
5. **JSON Parsing**: Handles invalid JSON gracefully
6. **Method Validation**: Only accepts POST requests
7. **CORS**: Supports cross-origin requests
8. **HTML Escaping**: Prevents XSS in email body
9. **API Errors**: Handles Resend API failures gracefully

## Security Features

- HTML escaping to prevent XSS attacks in email content
- Email format validation to prevent injection attacks
- Length limits to prevent DoS attacks
- CORS headers configured for cross-origin requests
- Environment variable validation before processing

## Error Handling

The function returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation errors, invalid JSON)
- `405`: Method Not Allowed (non-POST requests)
- `500`: Internal Server Error (email service failures, unexpected errors)

## Integration

This function is integrated with the Web app contact form in `Web/pages/Contact.tsx`.

The form should be updated (PRD-49) to call this edge function instead of the current stub implementation.
