import { describe, it, expect, vi, beforeEach } from "vitest";
import { Role } from "@prisma/client";
import * as actions from "@/modules/users/actions";
import * as queries from "@/modules/users/queries";
import { createMockProfile } from "../../test-utils";

// Mock auth and rbac
vi.mock("@/core/auth", () => ({
  requireAuth: vi.fn(() => Promise.resolve({ userId: "test-user-id" })),
}));

vi.mock("@/core/rbac", () => ({
  requireRole: vi.fn(() => Promise.resolve(true)),
}));

// Mock errors
vi.mock("@/core/errors", () => ({
  captureError: vi.fn(),
}));

// Mock Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock queries
vi.mock("@/modules/users/queries");

describe("Users Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("completeOnboarding", () => {
    it("should complete onboarding successfully", async () => {
      const mockProfile = createMockProfile();
      
      vi.mocked(queries.getProfileByUserId).mockResolvedValue(null);
      vi.mocked(queries.createProfile).mockResolvedValue(mockProfile);

      const formData = new FormData();
      formData.append("name", "John Doe");
      formData.append("email", "john@example.com");
      formData.append("bio", "Developer");
      formData.append("role", Role.PARTICIPANT);
      formData.append("techStack", JSON.stringify(["JavaScript"]));

      const result = await actions.completeOnboarding(formData);

      expect(result.success).toBe(true);
      expect(result.data?.profileId).toBe(mockProfile.id);
      expect(queries.createProfile).toHaveBeenCalled();
    });

    it("should reject if profile already exists", async () => {
      const mockProfile = createMockProfile();
      
      vi.mocked(queries.getProfileByUserId).mockResolvedValue(mockProfile);

      const formData = new FormData();
      formData.append("name", "John");
      formData.append("surname", "Doe");
      formData.append("role", Role.PARTICIPANT);

      const result = await actions.completeOnboarding(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("completado el proceso");
      expect(queries.createProfile).not.toHaveBeenCalled();
    });

    it("should reject invalid form data", async () => {
      vi.mocked(queries.getProfileByUserId).mockResolvedValue(null);

      const formData = new FormData();
      // Missing required fields

      const result = await actions.completeOnboarding(formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("inválidos");
    });

    it("should handle errors gracefully", async () => {
      vi.mocked(queries.getProfileByUserId).mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("name", "John");
      formData.append("surname", "Doe");
      formData.append("role", Role.PARTICIPANT);

      const result = await actions.completeOnboarding(formData);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe("updateUserProfile", () => {
    it("should update profile successfully", async () => {
      const mockProfile = createMockProfile({
        id: "profile-123",
        userId: "test-user-id",
      });

      vi.mocked(queries.getProfileByUserId).mockResolvedValue(mockProfile);
      vi.mocked(queries.updateProfile).mockResolvedValue(mockProfile);

      const formData = new FormData();
      formData.append("name", "Jane");
      formData.append("bio", "Updated bio");

      const result = await actions.updateUserProfile("profile-123", formData);

      expect(result.success).toBe(true);
      expect(queries.updateProfile).toHaveBeenCalledWith(
        "profile-123",
        expect.any(Object)
      );
    });

    it("should reject if user does not own profile", async () => {
      const mockProfile = createMockProfile({
        id: "other-profile",
        userId: "other-user",
      });

      vi.mocked(queries.getProfileByUserId).mockResolvedValue(mockProfile);

      const formData = new FormData();
      formData.append("name", "Hacker");

      const result = await actions.updateUserProfile("profile-123", formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("permiso");
      expect(queries.updateProfile).not.toHaveBeenCalled();
    });

    it("should reject if profile not found", async () => {
      vi.mocked(queries.getProfileByUserId).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("name", "John");

      const result = await actions.updateUserProfile("profile-123", formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("permiso");
    });

    it("should accept partial updates", async () => {
      const mockProfile = createMockProfile({
        id: "profile-123",
        userId: "test-user-id",
      });

      vi.mocked(queries.getProfileByUserId).mockResolvedValue(mockProfile);
      vi.mocked(queries.updateProfile).mockResolvedValue(mockProfile);

      const formData = new FormData();
      formData.append("bio", "New bio only");

      const result = await actions.updateUserProfile("profile-123", formData);

      expect(result.success).toBe(true);
    });

    it("should reject invalid form data", async () => {
      const mockProfile = createMockProfile({
        id: "profile-123",
        userId: "test-user-id",
      });

      vi.mocked(queries.getProfileByUserId).mockResolvedValue(mockProfile);

      const formData = new FormData();
      formData.append("name", "A"); // Too short

      const result = await actions.updateUserProfile("profile-123", formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("inválidos");
      expect(queries.updateProfile).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      const mockProfile = createMockProfile({
        id: "profile-123",
        userId: "test-user-id",
      });

      vi.mocked(queries.getProfileByUserId).mockResolvedValue(mockProfile);
      vi.mocked(queries.updateProfile).mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("name", "Jane Doe");

      const result = await actions.updateUserProfile("profile-123", formData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error al actualizar el perfil");
    });
  });

  describe("updateUserRole", () => {
    it("should update role successfully (admin)", async () => {
      const mockProfile = createMockProfile({ role: Role.JUDGE });

      vi.mocked(queries.profileExists).mockResolvedValue(true);
      vi.mocked(queries.updateProfileRole).mockResolvedValue(mockProfile);

      const result = await actions.updateUserRole("profile-123", Role.JUDGE);

      expect(result.success).toBe(true);
      expect(queries.updateProfileRole).toHaveBeenCalledWith(
        "profile-123",
        Role.JUDGE
      );
    });

    it("should reject invalid role", async () => {
      const result = await actions.updateUserRole(
        "profile-123",
        "INVALID_ROLE"
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("inválido");
      expect(queries.updateProfileRole).not.toHaveBeenCalled();
    });

    it("should reject if profile not found", async () => {
      vi.mocked(queries.profileExists).mockResolvedValue(false);

      const result = await actions.updateUserRole("profile-123", Role.ADMIN);

      expect(result.success).toBe(false);
      expect(result.error).toContain("no encontrado");
      expect(queries.updateProfileRole).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(queries.profileExists).mockResolvedValue(true);
      vi.mocked(queries.updateProfileRole).mockRejectedValue(
        new Error("Database error")
      );

      const result = await actions.updateUserRole("profile-123", Role.ORGANIZER);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error al actualizar el rol");
    });
  });

  describe("listAllProfiles", () => {
    it("should list profiles successfully (admin)", async () => {
      const mockProfiles = [
        createMockProfile({ id: "1" }),
        createMockProfile({ id: "2" }),
      ];

      const mockResult = {
        profiles: mockProfiles,
        total: 2,
        limit: 10,
        offset: 0,
      };

      vi.mocked(queries.listProfiles).mockResolvedValue(mockResult);

      const result = await actions.listAllProfiles();

      expect(result.success).toBe(true);
      expect(result.data?.profiles).toEqual(mockProfiles);
      expect(result.data?.total).toBe(2);
    });

    it("should apply filters correctly", async () => {
      const mockResult = {
        profiles: [createMockProfile({ role: Role.JUDGE })],
        total: 1,
        limit: 10,
        offset: 0,
      };

      vi.mocked(queries.listProfiles).mockResolvedValue(mockResult);

      const result = await actions.listAllProfiles({
        role: Role.JUDGE,
        search: "john",
      });

      expect(result.success).toBe(true);
      expect(queries.listProfiles).toHaveBeenCalledWith({
        role: Role.JUDGE,
        search: "john",
      });
    });

    it("should reject invalid filters", async () => {
      const result = await actions.listAllProfiles({
        // @ts-expect-error: Testing invalid role
        role: "INVALID",
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("inválidos");
      expect(queries.listProfiles).not.toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(queries.listProfiles).mockRejectedValue(
        new Error("Database error")
      );

      const result = await actions.listAllProfiles();

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error al obtener la lista");
    });
  });

  describe("deleteUserProfile", () => {
    it("should return not implemented error", async () => {
      vi.mocked(queries.profileExists).mockResolvedValue(true);

      const result = await actions.deleteUserProfile("profile-123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("no implementada");
    });

    it("should reject if profile not found", async () => {
      vi.mocked(queries.profileExists).mockResolvedValue(false);

      const result = await actions.deleteUserProfile("profile-123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("no encontrado");
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(queries.profileExists).mockRejectedValue(
        new Error("Database error")
      );

      const result = await actions.deleteUserProfile("profile-123");

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error al eliminar el perfil");
    });
  });
});
