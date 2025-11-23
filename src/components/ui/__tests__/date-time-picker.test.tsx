import { describe, it, expect } from 'vitest';
import { 
  dateToDateTimeLocal, 
  dateTimeLocalToDate,
  getCurrentDateTimeLocal,
  formatDateTimeLocal 
} from '@/components/ui/date-time-picker';

// Simplified tests - only testing helper functions
describe('DateTimePicker Helpers', () => {
  describe('dateToDateTimeLocal', () => {
    it('should convert Date to datetime-local string', () => {
      const date = new Date('2025-12-15T14:30:00');
      const result = dateToDateTimeLocal(date);
      
      expect(result).toBe('2025-12-15T14:30');
    });

    it('should handle null', () => {
      const result = dateToDateTimeLocal(null);
      expect(result).toBe('');
    });
  });

  describe('dateTimeLocalToDate', () => {
    it('should convert datetime-local string to Date', () => {
      const result = dateTimeLocalToDate('2025-12-15T14:30');
      
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(15);
    });

    it('should handle empty string', () => {
      const result = dateTimeLocalToDate('');
      expect(result).toBeNull();
    });
  });

  describe('getCurrentDateTimeLocal', () => {
    it('should return current datetime in local format', () => {
      const result = getCurrentDateTimeLocal();
      
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });
  });

  describe('formatDateTimeLocal', () => {
    it('should format Date to readable string', () => {
      const date = new Date('2025-12-15T14:30:00');
      const result = formatDateTimeLocal(date);
      
      expect(result).toContain('15');
      expect(result).toContain('Dec');
      expect(result).toContain('2025');
    });

    it('should handle null', () => {
      const result = formatDateTimeLocal(null);
      expect(result).toBe('');
    });
  });
});
