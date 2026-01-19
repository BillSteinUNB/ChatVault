import { supabase } from './supabase';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormResponse {
  success?: boolean;
  error?: string;
  message?: string;
  details?: string;
}

/**
 * Submit contact form to the backend via Supabase Edge Function
 * @param data - Contact form data containing name, email, and message
 * @returns Promise with response containing success status or error details
 */
export async function submitContactForm(data: ContactForm): Promise<ContactFormResponse> {
  try {
    const { data: responseData, error } = await supabase.functions.invoke('contact', {
      body: data,
    });

    if (error) {
      console.error('Supabase function error:', error);
      return {
        error: 'Failed to submit contact form',
        details: error.message || 'Unknown error occurred',
      };
    }

    // Check if the edge function returned an error
    if (responseData && typeof responseData === 'object') {
      if ('error' in responseData) {
        return {
          error: responseData.error as string,
          details: 'details' in responseData ? (responseData.details as string) : undefined,
        };
      }

      if ('success' in responseData && responseData.success) {
        return {
          success: true,
          message: responseData.message as string || 'Contact form submitted successfully',
        };
      }
    }

    return {
      success: true,
      message: 'Contact form submitted successfully',
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    if (error instanceof Error) {
      return {
        error: 'Failed to submit contact form',
        details: error.message,
      };
    }

    return {
      error: 'Failed to submit contact form',
      details: 'An unexpected error occurred',
    };
  }
}
