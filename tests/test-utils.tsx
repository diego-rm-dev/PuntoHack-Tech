import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ClerkProvider } from "@clerk/nextjs";

// Mock Clerk Provider for tests
const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function with providers
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <MockClerkProvider>{children}</MockClerkProvider>
    ),
    ...options,
  });
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: "test-user-id",
  clerkId: "clerk_test_user_id",
  email: "test@example.com",
  name: "Test User",
  role: "USER" as const,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  ...overrides,
});

export const createMockProfile = (overrides = {}) => ({
  id: "test-profile-id",
  userId: "test-user-id",
  name: "Test User",
  email: "test@example.com",
  bio: "Test bio",
  avatarUrl: "https://example.com/avatar.jpg",
  techStack: ["JavaScript", "TypeScript"],
  role: "PARTICIPANT" as const,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  ...overrides,
});

export const createMockHackathon = (overrides = {}) => ({
  id: "test-hackathon-id",
  title: "Test Hackathon",
  description: "Test description",
  startDate: new Date("2025-12-01"),
  endDate: new Date("2025-12-15"),
  status: "UPCOMING" as const,
  maxTeamSize: 5,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  ...overrides,
});
