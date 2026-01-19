import { describe, it, expect } from 'vitest';
import { PLATFORM_CONFIG } from '../constants';

describe('PRD-23: Perplexity Manifest & Integration', () => {
  describe('PLATFORM_CONFIG', () => {
    it('should include perplexity platform configuration', () => {
      expect(PLATFORM_CONFIG.perplexity).toBeDefined();
    });

    it('should have correct name for perplexity', () => {
      expect(PLATFORM_CONFIG.perplexity.name).toBe('Perplexity');
    });

    it('should have correct color #20B2AA for perplexity', () => {
      expect(PLATFORM_CONFIG.perplexity.color).toBe('#20B2AA');
    });

    it('should have 🔍 icon for perplexity', () => {
      expect(PLATFORM_CONFIG.perplexity.icon).toBe('🔍');
    });

    it('should have urlPattern for perplexity', () => {
      expect(PLATFORM_CONFIG.perplexity.urlPattern).toBeDefined();
      expect(PLATFORM_CONFIG.perplexity.urlPattern).toBeInstanceOf(RegExp);
    });

    it('should match perplexity.ai URLs', () => {
      const urlPattern = PLATFORM_CONFIG.perplexity.urlPattern;
      expect(urlPattern?.test('https://www.perplexity.ai/')).toBe(true);
      expect(urlPattern?.test('https://perplexity.ai/')).toBe(true);
      expect(urlPattern?.test('https://www.perplexity.ai/chat/test')).toBe(true);
    });

    it('should not match non-perplexity URLs', () => {
      const urlPattern = PLATFORM_CONFIG.perplexity.urlPattern;
      expect(urlPattern?.test('https://chatgpt.com/')).toBe(false);
      expect(urlPattern?.test('https://claude.ai/')).toBe(false);
      expect(urlPattern?.test('https://google.com/')).toBe(false);
    });
  });

  describe('Platform Configuration Completeness', () => {
    it('should have all three platforms configured', () => {
      expect(Object.keys(PLATFORM_CONFIG)).toHaveLength(3);
      expect(PLATFORM_CONFIG.chatgpt).toBeDefined();
      expect(PLATFORM_CONFIG.claude).toBeDefined();
      expect(PLATFORM_CONFIG.perplexity).toBeDefined();
    });

    it('should have required properties for each platform', () => {
      Object.values(PLATFORM_CONFIG).forEach(config => {
        expect(config.name).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.icon).toBeDefined();
      });
    });
  });
});
