import { describe, it, expect } from "vitest";
import { Role } from "@prisma/client";
import {
  roleSchema,
  publicRoleSchema,
  createProfileSchema,
  updateProfileSchema,
  updateRoleSchema,
  listProfilesFiltersSchema,
} from "@/modules/users/validations";

describe("Users Validations", () => {
  describe("roleSchema", () => {
    it("should accept all valid roles", () => {
      const roles = [
        Role.PARTICIPANT,
        Role.JUDGE,
        Role.ORGANIZER,
        Role.SPONSOR,
        Role.ADMIN,
      ];

      roles.forEach((role) => {
        expect(() => roleSchema.parse(role)).not.toThrow();
      });
    });

    it("should reject invalid roles", () => {
      expect(() => roleSchema.parse("INVALID_ROLE")).toThrow();
      expect(() => roleSchema.parse("")).toThrow();
      expect(() => roleSchema.parse(null)).toThrow();
    });
  });

  describe("publicRoleSchema", () => {
    it("should accept public roles only", () => {
      const publicRoles = [
        Role.PARTICIPANT,
        Role.JUDGE,
        Role.ORGANIZER,
        Role.SPONSOR,
      ];

      publicRoles.forEach((role) => {
        expect(() => publicRoleSchema.parse(role)).not.toThrow();
      });
    });

    it("should reject ADMIN role", () => {
      expect(() => publicRoleSchema.parse(Role.ADMIN)).toThrow();
    });

    it("should reject invalid values", () => {
      expect(() => publicRoleSchema.parse("INVALID")).toThrow();
      expect(() => publicRoleSchema.parse(123)).toThrow();
    });
  });

  describe("createProfileSchema", () => {
    const validProfile = {
      userId: "user_123",
      name: "John Doe",
      email: "john@example.com",
      role: Role.PARTICIPANT,
    };

    it("should accept valid profile data", () => {
      const result = createProfileSchema.parse(validProfile);
      expect(result).toEqual(validProfile);
    });

    it("should accept optional fields", () => {
      const profileWithOptionals = {
        ...validProfile,
        avatarUrl: "https://example.com/avatar.jpg",
        bio: "Software developer",
        techStack: ["TypeScript", "React", "Node.js"],
      };

      const result = createProfileSchema.parse(profileWithOptionals);
      expect(result).toEqual(profileWithOptionals);
    });

    it("should reject missing required fields", () => {
      expect(() => createProfileSchema.parse({})).toThrow();
      expect(() =>
        createProfileSchema.parse({ userId: "user_123" })
      ).toThrow();
      expect(() =>
        createProfileSchema.parse({ userId: "user_123", name: "John" })
      ).toThrow();
    });

    it("should reject invalid userId", () => {
      expect(() =>
        createProfileSchema.parse({ ...validProfile, userId: "" })
      ).toThrow();
    });

    it("should reject short names", () => {
      expect(() =>
        createProfileSchema.parse({ ...validProfile, name: "J" })
      ).toThrow();
    });

    it("should reject long names", () => {
      const longName = "a".repeat(101);
      expect(() =>
        createProfileSchema.parse({ ...validProfile, name: longName })
      ).toThrow();
    });

    it("should reject invalid email format", () => {
      expect(() =>
        createProfileSchema.parse({ ...validProfile, email: "invalid-email" })
      ).toThrow();
    });

    it("should reject invalid avatar URL", () => {
      expect(() =>
        createProfileSchema.parse({
          ...validProfile,
          avatarUrl: "not-a-url",
        })
      ).toThrow();
    });

    it("should reject long bio", () => {
      const longBio = "a".repeat(501);
      expect(() =>
        createProfileSchema.parse({ ...validProfile, bio: longBio })
      ).toThrow();
    });

    it("should reject too many tech stack items", () => {
      const tooManyItems = Array(11).fill("JavaScript");
      expect(() =>
        createProfileSchema.parse({
          ...validProfile,
          techStack: tooManyItems,
        })
      ).toThrow();
    });

    it("should reject empty tech stack items", () => {
      expect(() =>
        createProfileSchema.parse({
          ...validProfile,
          techStack: [""],
        })
      ).toThrow();
    });

    it("should reject long tech stack items", () => {
      const longTech = "a".repeat(51);
      expect(() =>
        createProfileSchema.parse({
          ...validProfile,
          techStack: [longTech],
        })
      ).toThrow();
    });

    it("should reject invalid public roles", () => {
      expect(() =>
        createProfileSchema.parse({ ...validProfile, role: Role.ADMIN })
      ).toThrow();
    });
  });

  describe("updateProfileSchema", () => {
    it("should accept valid update data", () => {
      const updateData = {
        name: "Jane Doe",
        bio: "Updated bio",
        techStack: ["Python", "Django"],
      };

      const result = updateProfileSchema.parse(updateData);
      expect(result).toEqual(updateData);
    });

    it("should accept partial updates", () => {
      expect(() =>
        updateProfileSchema.parse({ name: "Jane Doe" })
      ).not.toThrow();
      expect(() =>
        updateProfileSchema.parse({ bio: "New bio" })
      ).not.toThrow();
      expect(() =>
        updateProfileSchema.parse({ techStack: ["React"] })
      ).not.toThrow();
    });

    it("should accept empty object (no updates)", () => {
      expect(() => updateProfileSchema.parse({})).not.toThrow();
    });

    it("should accept null bio", () => {
      expect(() =>
        updateProfileSchema.parse({ bio: null })
      ).not.toThrow();
    });

    it("should reject invalid name", () => {
      expect(() => updateProfileSchema.parse({ name: "A" })).toThrow();
      expect(() =>
        updateProfileSchema.parse({ name: "a".repeat(101) })
      ).toThrow();
    });

    it("should reject invalid bio", () => {
      const longBio = "a".repeat(501);
      expect(() => updateProfileSchema.parse({ bio: longBio })).toThrow();
    });

    it("should reject invalid tech stack", () => {
      const tooManyItems = Array(11).fill("JavaScript");
      expect(() =>
        updateProfileSchema.parse({ techStack: tooManyItems })
      ).toThrow();
    });
  });

  describe("updateRoleSchema", () => {
    it("should accept valid role updates", () => {
      const roles = [
        Role.PARTICIPANT,
        Role.JUDGE,
        Role.ORGANIZER,
        Role.SPONSOR,
        Role.ADMIN,
      ];

      roles.forEach((role) => {
        const result = updateRoleSchema.parse({ role });
        expect(result).toEqual({ role });
      });
    });

    it("should reject missing role", () => {
      expect(() => updateRoleSchema.parse({})).toThrow();
    });

    it("should reject invalid role", () => {
      expect(() =>
        updateRoleSchema.parse({ role: "INVALID_ROLE" })
      ).toThrow();
    });
  });

  describe("listProfilesFiltersSchema", () => {
    it("should accept valid filters", () => {
      const filters = {
        role: Role.PARTICIPANT,
        search: "john",
        limit: 20,
        offset: 10,
      };

      const result = listProfilesFiltersSchema.parse(filters);
      expect(result).toEqual(filters);
    });

    it("should accept empty filters", () => {
      expect(() => listProfilesFiltersSchema.parse({})).not.toThrow();
    });

    it("should accept partial filters", () => {
      expect(() =>
        listProfilesFiltersSchema.parse({ role: Role.JUDGE })
      ).not.toThrow();
      expect(() =>
        listProfilesFiltersSchema.parse({ search: "test" })
      ).not.toThrow();
      expect(() =>
        listProfilesFiltersSchema.parse({ limit: 50 })
      ).not.toThrow();
    });

    it("should reject invalid role filter", () => {
      expect(() =>
        listProfilesFiltersSchema.parse({ role: "INVALID" })
      ).toThrow();
    });

    it("should reject long search string", () => {
      const longSearch = "a".repeat(101);
      expect(() =>
        listProfilesFiltersSchema.parse({ search: longSearch })
      ).toThrow();
    });

    it("should reject invalid limit", () => {
      expect(() => listProfilesFiltersSchema.parse({ limit: 0 })).toThrow();
      expect(() => listProfilesFiltersSchema.parse({ limit: 101 })).toThrow();
      expect(() =>
        listProfilesFiltersSchema.parse({ limit: -1 })
      ).toThrow();
      expect(() =>
        listProfilesFiltersSchema.parse({ limit: 1.5 })
      ).toThrow();
    });

    it("should reject invalid offset", () => {
      expect(() =>
        listProfilesFiltersSchema.parse({ offset: -1 })
      ).toThrow();
      expect(() =>
        listProfilesFiltersSchema.parse({ offset: 1.5 })
      ).toThrow();
    });
  });
});
