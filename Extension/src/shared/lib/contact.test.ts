/**
 * Tests for contact service (Web/services/contact.ts)
 *
 * Note: The Web project doesn't have testing infrastructure, so we test from the Extension directory
 * which has vitest configured. The contact service is in Web/services/contact.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire supabase service module BEFORE importing the contact service
// Note: vi.mock is hoisted, so we must define the mock inline
vi.mock('../../../../Web/services/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Import after mocking
import { submitContactForm, ContactForm } from '../../../../Web/services/contact';

// Get reference to the mocked function
const getMockInvoke = () => {
  const { supabase } = require('../../../../Web/services/supabase');
  return supabase.functions.invoke;
};

describe('Contact Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const validFormData: ContactForm = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message',
  };

  describe('submitContactForm', () => {
    it('should successfully submit a valid contact form', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockResolvedValue({
        data: { success: true, message: 'Contact form submitted successfully' },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result).toEqual({
        success: true,
        message: 'Contact form submitted successfully',
      });
      expect(mockInvoke).toHaveBeenCalledWith('contact', {
        body: validFormData,
      });
    });

    it('should handle edge function error response', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockResolvedValue({
        data: { error: 'Missing required fields' },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result.error).toBe('Missing required fields');
      expect(result.success).toBeUndefined();
    });

    it('should handle edge function error with details', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockResolvedValue({
        data: {
          error: 'Email service not configured',
          details: 'The contact form is not properly configured. Please contact support directly.',
        },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result.error).toBe('Email service not configured');
      expect(result.details).toBe('The contact form is not properly configured. Please contact support directly.');
    });

    it('should handle Supabase function error', async () => {
      const mockInvoke = getMockInvoke();
      const supabaseError = new Error('Network error');
      mockInvoke.mockResolvedValue({
        data: null,
        error: supabaseError,
      });

      const result = await submitContactForm(validFormData);

      expect(result.error).toBe('Failed to submit contact form');
      expect(result.details).toBe('Network error');
    });

    it('should handle network errors', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockRejectedValue(new Error('Failed to fetch'));

      const result = await submitContactForm(validFormData);

      expect(result.error).toBe('Failed to submit contact form');
      expect(result.details).toBe('Failed to fetch');
    });

    it('should handle unknown errors', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockRejectedValue('Unknown error');

      const result = await submitContactForm(validFormData);

      expect(result.error).toBe('Failed to submit contact form');
      expect(result.details).toBe('An unexpected error occurred');
    });

    it('should trim form data before submitting', async () => {
      const mockInvoke = getMockInvoke();
      const untrimmedData: ContactForm = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        message: '  This is a test message  ',
      };

      const expectedTrimmedData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      };

      mockInvoke.mockResolvedValue({
        data: { success: true },
        error: null,
      });

      await submitContactForm(untrimmedData);

      expect(mockInvoke).toHaveBeenCalledWith('contact', {
        body: expectedTrimmedData,
      });
    });

    it('should handle response with custom success message', async () => {
      const mockInvoke = getMockInvoke();
      const customMessage = 'Thank you for your feedback!';
      mockInvoke.mockResolvedValue({
        data: { success: true, message: customMessage },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(true);
      expect(result.message).toBe(customMessage);
    });

    it('should handle edge function returning success without message', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockResolvedValue({
        data: { success: true },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Contact form submitted successfully');
    });

    it('should handle empty response data', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Contact form submitted successfully');
    });

    it('should include error details when available', async () => {
      const mockInvoke = getMockInvoke();
      const errorMessage = 'Invalid email format';
      mockInvoke.mockResolvedValue({
        data: { error: errorMessage, details: 'Email must be a valid format' },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      expect(result.error).toBe(errorMessage);
      expect(result.details).toBe('Email must be a valid format');
    });

    it('should handle edge function returning object without success field', async () => {
      const mockInvoke = getMockInvoke();
      mockInvoke.mockResolvedValue({
        data: { id: '12345', status: 'queued' },
        error: null,
      });

      const result = await submitContactForm(validFormData);

      // Should treat as success since there's no error field
      expect(result.success).toBe(true);
      expect(result.message).toBe('Contact form submitted successfully');
    });

    it('should log errors to console', async () => {
      const mockInvoke = getMockInvoke();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockInvoke.mockRejectedValue(new Error('Test error'));

      await submitContactForm(validFormData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error submitting contact form:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should log Supabase function errors to console', async () => {
      const mockInvoke = getMockInvoke();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const supabaseError = new Error('Supabase error');
      mockInvoke.mockResolvedValue({
        data: null,
        error: supabaseError,
      });

      await submitContactForm(validFormData);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Supabase function error:',
        supabaseError
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
