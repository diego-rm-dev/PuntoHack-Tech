import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_mock";
process.env.CLERK_SECRET_KEY = "sk_test_mock";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(() => ({
    userId: "test-user-id",
    sessionId: "test-session-id",
  })),
  currentUser: vi.fn(() => ({
    id: "test-user-id",
    emailAddresses: [{ emailAddress: "test@example.com" }],
    firstName: "Test",
    lastName: "User",
  })),
}));

// Global test utilities
declare global {
  var testUserId: string;
  var testEmail: string;
}

global.testUserId = "test-user-id";
global.testEmail = "test@example.com";
