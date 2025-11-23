import { describe, it, expect } from 'vitest';
import { 
  createHackathonSchema,
  createCriterionSchema,
  listHackathonsFiltersSchema 
} from '@/modules/hackathons/validations';

describe('Hackathons Validations', () => {
  describe('createHackathonSchema', () => {
    it('should validate valid hackathon data', () => {
      const validData = {
        name: 'Test Hackathon 2025',
        slug: 'test-hackathon-2025',
        description: 'A test hackathon for testing purposes. This description is long enough to pass validation requirements.',
        registrationOpensAt: new Date('2025-12-01'),
        registrationClosesAt: new Date('2025-12-15'),
        startsAt: new Date('2025-12-20'),
        endsAt: new Date('2025-12-22'),
        judgingStartsAt: new Date('2025-12-22'),
        judgingEndsAt: new Date('2025-12-25'),
        minTeamSize: 1,
        maxTeamSize: 5,
      };

      const result = createHackathonSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid slug format', () => {
      const invalidData = {
        name: 'Test Hackathon',
        slug: 'TEST_HACKATHON!!!',
        description: 'Valid description here.',
        registrationOpensAt: new Date('2025-12-01'),
        registrationClosesAt: new Date('2025-12-15'),
        startsAt: new Date('2025-12-20'),
        endsAt: new Date('2025-12-22'),
        judgingStartsAt: new Date('2025-12-22'),
        judgingEndsAt: new Date('2025-12-25'),
        minTeamSize: 1,
        maxTeamSize: 5,
      };

      const result = createHackathonSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toBeDefined();
      }
    });

    it('should reject registration closing after event start', () => {
      const invalidData = {
        name: 'Test Hackathon',
        slug: 'test-hackathon',
        description: 'Valid description.',
        registrationOpensAt: new Date('2025-12-01'),
        registrationClosesAt: new Date('2025-12-25'), // After start!
        startsAt: new Date('2025-12-20'),
        endsAt: new Date('2025-12-22'),
        judgingStartsAt: new Date('2025-12-22'),
        judgingEndsAt: new Date('2025-12-25'),
        minTeamSize: 1,
        maxTeamSize: 5,
      };

      const result = createHackathonSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject minTeamSize > maxTeamSize', () => {
      const invalidData = {
        name: 'Test Hackathon',
        slug: 'test-hackathon',
        description: 'Valid description.',
        registrationOpensAt: new Date('2025-12-01'),
        registrationClosesAt: new Date('2025-12-15'),
        startsAt: new Date('2025-12-20'),
        endsAt: new Date('2025-12-22'),
        judgingStartsAt: new Date('2025-12-22'),
        judgingEndsAt: new Date('2025-12-25'),
        minTeamSize: 10, // Greater than max!
        maxTeamSize: 5,
      };

      const result = createHackathonSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createCriterionSchema', () => {
    it('should validate valid criterion', () => {
      const validData = {
        hackathonId: 'cm123456',
        name: 'Innovation',
        description: 'Measures the originality of the solution',
        weight: 3,
        maxScore: 10,
      };

      const result = createCriterionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid weight', () => {
      const invalidData = {
        hackathonId: 'cm123456',
        name: 'Innovation',
        description: 'Test',
        weight: 11, // Too high (max is 10)
        maxScore: 10,
      };

      const result = createCriterionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid maxScore', () => {
      const invalidData = {
        hackathonId: 'cm123456',
        name: 'Innovation',
        description: 'Test',
        weight: 3,
        maxScore: 150, // Too high
      };

      const result = createCriterionSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('listHackathonsFiltersSchema', () => {
    it('should validate valid filters', () => {
      const validFilters = {
        search: 'hackathon',
        status: 'REGISTRATION',
        limit: 20,
        offset: 0,
      };

      const result = listHackathonsFiltersSchema.safeParse(validFilters);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidFilters = {
        status: 'INVALID_STATUS',
      };

      const result = listHackathonsFiltersSchema.safeParse(invalidFilters);
      expect(result.success).toBe(false);
    });

    it('should reject negative limit', () => {
      const invalidFilters = {
        limit: -10,
      };

      const result = listHackathonsFiltersSchema.safeParse(invalidFilters);
      expect(result.success).toBe(false);
    });
  });
});
