import { describe, it, expect, vi, beforeEach } from "vitest";
import { Role } from "@prisma/client";
import * as queries from "@/modules/users/queries";
import { createMockUser, createMockProfile } from "../../test-utils";

// Mock Supabase client
const mockSupabaseQuery = {
  from: vi.fn(),
  insert: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
  eq: vi.fn(),
  or: vi.fn(),
  range: vi.fn(),
  order: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/core/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseQuery)),
}));

// Mock CUID
vi.mock("@paralleldrive/cuid2", () => ({
  createId: vi.fn(() => "test-cuid-123"),
}));

describe("Users Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock chain
    mockSupabaseQuery.from.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.insert.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.select.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.eq.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.or.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.range.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.order.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.update.mockReturnValue(mockSupabaseQuery);
    mockSupabaseQuery.delete.mockReturnValue(mockSupabaseQuery);
  });

  describe("createProfile", () => {
    it("should create a profile successfully", async () => {
      const mockProfile = createMockProfile();
      const input = {
        userId: "user-123",
        name: "John Doe",
        email: "john@example.com",
        role: Role.PARTICIPANT,
      };

      mockSupabaseQuery.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await queries.createProfile(input);

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.insert).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });

    it("should throw error on creation failure", async () => {
      const input = {
        userId: "user-123",
        name: "John Doe",
        role: Role.PARTICIPANT,
      };

      mockSupabaseQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(queries.createProfile(input)).rejects.toThrow(
        "Failed to create profile"
      );
    });
  });

  describe("getProfileById", () => {
    it("should return profile when found", async () => {
      const mockProfile = createMockProfile();

      mockSupabaseQuery.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await queries.getProfileById("profile-123");

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "profile-123");
      expect(result).toEqual(mockProfile);
    });

    it("should return null when profile not found", async () => {
      mockSupabaseQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      });

      const result = await queries.getProfileById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getProfileByUserId", () => {
    it("should return profile when found", async () => {
      const mockProfile = createMockProfile();

      mockSupabaseQuery.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await queries.getProfileByUserId("user-123");

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("userId", "user-123");
      expect(result).toEqual(mockProfile);
    });

    it("should return null when profile not found", async () => {
      mockSupabaseQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      });

      const result = await queries.getProfileByUserId("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("listProfiles", () => {
    it("should list profiles with default pagination", async () => {
      const mockProfiles = [
        createMockProfile({ id: "1" }),
        createMockProfile({ id: "2" }),
      ];

      mockSupabaseQuery.order.mockResolvedValue({
        data: mockProfiles,
        error: null,
        count: 2,
      });

      const result = await queries.listProfiles();

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.range).toHaveBeenCalledWith(0, 9);
      expect(result.profiles).toEqual(mockProfiles);
      expect(result.total).toBe(2);
      expect(result.limit).toBe(10);
      expect(result.offset).toBe(0);
    });

    it("should filter profiles by role", async () => {
      const mockProfiles = [createMockProfile({ role: Role.JUDGE })];

      mockSupabaseQuery.order.mockResolvedValue({
        data: mockProfiles,
        error: null,
        count: 1,
      });

      await queries.listProfiles({ role: Role.JUDGE });

      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("role", Role.JUDGE);
    });

    it("should filter profiles by search term", async () => {
      mockSupabaseQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      await queries.listProfiles({ search: "john" });

      expect(mockSupabaseQuery.or).toHaveBeenCalledWith(
        "name.ilike.%john%,email.ilike.%john%"
      );
    });

    it("should apply custom pagination", async () => {
      mockSupabaseQuery.order.mockResolvedValue({
        data: [],
        error: null,
        count: 0,
      });

      await queries.listProfiles({ limit: 20, offset: 10 });

      expect(mockSupabaseQuery.range).toHaveBeenCalledWith(10, 29);
    });

    it("should throw error on listing failure", async () => {
      mockSupabaseQuery.order.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
        count: 0,
      });

      await expect(queries.listProfiles()).rejects.toThrow(
        "Failed to list profiles"
      );
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      const mockProfile = createMockProfile({ name: "Updated Name" });
      const updateData = { name: "Updated Name" };

      mockSupabaseQuery.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await queries.updateProfile("profile-123", updateData);

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.update).toHaveBeenCalled();
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "profile-123");
      expect(result).toEqual(mockProfile);
    });

    it("should throw error on update failure", async () => {
      mockSupabaseQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Update failed" },
      });

      await expect(
        queries.updateProfile("profile-123", { name: "New Name" })
      ).rejects.toThrow("Failed to update profile");
    });
  });

  describe("updateProfileRole", () => {
    it("should update role successfully", async () => {
      const mockProfile = createMockProfile({ role: Role.JUDGE });

      mockSupabaseQuery.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await queries.updateProfileRole("profile-123", Role.JUDGE);

      expect(mockSupabaseQuery.update).toHaveBeenCalledWith(
        expect.objectContaining({ role: Role.JUDGE })
      );
      expect(result.role).toBe(Role.JUDGE);
    });

    it("should throw error on role update failure", async () => {
      mockSupabaseQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Role update failed" },
      });

      await expect(
        queries.updateProfileRole("profile-123", Role.ADMIN)
      ).rejects.toThrow("Failed to update role");
    });
  });

  describe("deleteProfile", () => {
    it("should delete profile successfully", async () => {
      mockSupabaseQuery.delete.mockReturnValue(mockSupabaseQuery);
      mockSupabaseQuery.eq.mockResolvedValue({
        error: null,
      });

      await expect(
        queries.deleteProfile("profile-123")
      ).resolves.toBeUndefined();

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "profile-123");
    });

    it("should throw error on deletion failure", async () => {
      mockSupabaseQuery.delete.mockReturnValue(mockSupabaseQuery);
      mockSupabaseQuery.eq.mockResolvedValue({
        error: { message: "Deletion failed" },
      });

      await expect(queries.deleteProfile("profile-123")).rejects.toThrow(
        "Failed to delete profile"
      );
    });
  });

  describe("profileExists", () => {
    it("should return true when profile exists", async () => {
      mockSupabaseQuery.single.mockResolvedValue({
        data: createMockProfile(),
        error: null,
      });

      const result = await queries.profileExists("user-123");

      expect(result).toBe(true);
    });

    it("should return false when profile does not exist", async () => {
      mockSupabaseQuery.single.mockResolvedValue({
        data: null,
        error: { message: "Not found" },
      });

      const result = await queries.profileExists("nonexistent");

      expect(result).toBe(false);
    });
  });

  describe("countProfilesByRole", () => {
    it("should count profiles by role successfully", async () => {
      mockSupabaseQuery.eq.mockResolvedValue({
        count: 5,
        error: null,
      });

      const result = await queries.countProfilesByRole(Role.PARTICIPANT);

      expect(mockSupabaseQuery.from).toHaveBeenCalledWith("profiles");
      expect(mockSupabaseQuery.eq).toHaveBeenCalledWith(
        "role",
        Role.PARTICIPANT
      );
      expect(result).toBe(5);
    });

    it("should return 0 when no profiles found", async () => {
      mockSupabaseQuery.eq.mockResolvedValue({
        count: 0,
        error: null,
      });

      const result = await queries.countProfilesByRole(Role.SPONSOR);

      expect(result).toBe(0);
    });

    it("should throw error on counting failure", async () => {
      mockSupabaseQuery.eq.mockResolvedValue({
        count: null,
        error: { message: "Count failed" },
      });

      await expect(
        queries.countProfilesByRole(Role.JUDGE)
      ).rejects.toThrow("Failed to count profiles");
    });
  });
});
