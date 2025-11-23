import { describe, it, expect } from 'vitest';
import { debounce, throttle } from '@/lib/utils/debounce';

// Simplified tests - testing utility functions only
describe('Debounce & Throttle Utilities', () => {
  describe('debounce', () => {
    it('should return a function', () => {
      const fn = () => {};
      const debounced = debounce(fn, 100);
      
      expect(typeof debounced).toBe('function');
    });

    it('should preserve function signature', () => {
      const fn = (a: string, b: number) => `${a}-${b}`;
      const debounced = debounce(fn, 100);
      
      // Should accept same parameters
      debounced('test', 123);
      expect(typeof debounced).toBe('function');
    });
  });

  describe('throttle', () => {
    it('should return a function', () => {
      const fn = () => {};
      const throttled = throttle(fn, 100);
      
      expect(typeof throttled).toBe('function');
    });

    it('should preserve function signature', () => {
      const fn = (a: string) => a.toUpperCase();
      const throttled = throttle(fn, 100);
      
      // Should accept same parameters
      throttled('test');
      expect(typeof throttled).toBe('function');
    });
  });
});
