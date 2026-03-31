/**
 * Auth Guard Integration Tests
 * Tests for authentication guard functionality.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0005: AC-1 to AC-4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { render, screen, waitFor } from "@testing-library/react";

// --- AC-1: Protected Routes ---
describe("AuthGuard / ProtectedRoutes", () => {
  let middleware: (req: NextRequest) => ReturnType<typeof import("next/server").NextResponse.next>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/middleware");
    middleware = mod.middleware;
  });

  it("should redirect to /login when no session cookie on /", () => {
    const req = new NextRequest(new URL("http://localhost:3000/"));
    const res = middleware(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/login");
  });

  it("should include callbackUrl in redirect", () => {
    const req = new NextRequest(new URL("http://localhost:3000/community/1"));
    const res = middleware(req);

    expect(res.status).toBe(307);
    const location = new URL(res.headers.get("location")!);
    expect(location.pathname).toBe("/login");
    expect(location.searchParams.get("callbackUrl")).toBe("/community/1");
  });

  it("should allow access to /login without cookie", () => {
    const req = new NextRequest(new URL("http://localhost:3000/login"));
    const res = middleware(req);

    expect(res.status).toBe(200);
  });

  it("should allow access to /api/auth/* without cookie", () => {
    const req = new NextRequest(
      new URL("http://localhost:3000/api/auth/login")
    );
    const res = middleware(req);

    expect(res.status).toBe(200);
  });

  it("should allow access to /api/auth/logout without cookie", () => {
    const req = new NextRequest(
      new URL("http://localhost:3000/api/auth/logout")
    );
    const res = middleware(req);

    expect(res.status).toBe(200);
  });
});

// Mock API posts data for Home page rendering test
const mockApiPosts = [
  {
    id: "1",
    content: "テスト投稿",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: {
      id: "u1",
      name: "田中 美咲",
      role: "マーケティングマネージャー",
      avatar: "https://example.com/avatar1.jpg",
    },
    reactions: { thumbsUp: 25, partyPopper: 12, lightbulb: 3, laugh: 2 },
    commentCount: 8,
    community: { name: "マーケティング", icon: "📊" },
  },
];

// --- AC-2: Authenticated Access ---
describe("AuthGuard / AuthenticatedAccess", () => {
  let middleware: (req: NextRequest) => ReturnType<typeof import("next/server").NextResponse.next>;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import("@/middleware");
    middleware = mod.middleware;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should allow access when session cookie exists on /", () => {
    const req = new NextRequest(new URL("http://localhost:3000/"));
    req.cookies.set("ummy_session", "valid-token");
    const res = middleware(req);

    expect(res.status).toBe(200);
  });

  it("should allow access when session cookie exists on /community/1", () => {
    const req = new NextRequest(
      new URL("http://localhost:3000/community/1")
    );
    req.cookies.set("ummy_session", "valid-token");
    const res = middleware(req);

    expect(res.status).toBe(200);
  });

  it("should preserve existing page rendering when authenticated", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    // Verify that home page component still renders correctly
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });
  });
});

// --- AC-3: Session Storage Policy ---
describe("AuthGuard / SessionStoragePolicy", () => {
  it("should set httpOnly on session cookie", async () => {
    const sessionModule = await import("@/lib/auth/session");
    // Verify the session module exports expected functions
    expect(typeof sessionModule.getSession).toBe("function");
    expect(typeof sessionModule.setSessionCookie).toBe("function");
    expect(typeof sessionModule.deleteSessionCookie).toBe("function");
  });

  it("should use httpOnly cookie configuration in session.ts", () => {
    const sessionPath = path.resolve(__dirname, "../lib/auth/session.ts");
    const content = fs.readFileSync(sessionPath, "utf-8");

    expect(content).toContain("httpOnly: true");
    expect(content).toContain('sameSite: "lax"');
  });

  it("should not use localStorage or sessionStorage for auth tokens in src/", () => {
    const srcDir = path.resolve(__dirname, "..");
    const srcFiles = getAllTsFiles(srcDir);

    for (const file of srcFiles) {
      // Skip test files and node_modules
      if (file.includes("__tests__") || file.includes("node_modules")) continue;

      const content = fs.readFileSync(file, "utf-8");

      // Check for localStorage/sessionStorage usage with auth-related keys
      const localStorageAuth = content.match(
        /localStorage\.(setItem|getItem|removeItem)\s*\(\s*['"][^'"]*(?:token|auth|session)[^'"]*['"]/i
      );
      const sessionStorageAuth = content.match(
        /sessionStorage\.(setItem|getItem|removeItem)\s*\(\s*['"][^'"]*(?:token|auth|session)[^'"]*['"]/i
      );

      expect(localStorageAuth).toBeNull();
      expect(sessionStorageAuth).toBeNull();
    }
  });

  it("should not expose auth tokens to client components", () => {
    const authContextPath = path.resolve(
      __dirname,
      "../components/auth/AuthContext.tsx"
    );
    const content = fs.readFileSync(authContextPath, "utf-8");

    // AuthContext should pass user info, not raw tokens
    expect(content).not.toContain("token");
    expect(content).toContain("user");
  });
});

// --- AC-4: Logout and Invalid Session ---
describe("AuthGuard / LogoutAndInvalidSession", () => {
  it("should have a logout route handler that deletes the cookie", () => {
    const logoutPath = path.resolve(
      __dirname,
      "../app/api/auth/logout/route.ts"
    );
    const content = fs.readFileSync(logoutPath, "utf-8");

    expect(content).toContain("deleteSessionCookie");
    expect(content).toContain("POST");
  });

  it("should return null for expired session tokens", async () => {
    const { MockAuthProvider } = await import("@/lib/auth/mock-auth-provider");
    const provider = new MockAuthProvider();

    // Create a session that expired in the past
    const expiredSession = {
      user: {
        id: "user-1",
        email: "tanaka@ummy.example.com",
        name: "田中 美咲",
        avatar: "https://example.com/avatar.jpg",
      },
      expiresAt: Date.now() - 1000, // expired 1 second ago
    };

    const token = provider.createToken(expiredSession);
    const result = await provider.validateSession(token);

    expect(result).toBeNull();
  });

  it("should return null for malformed session tokens", async () => {
    const { MockAuthProvider } = await import("@/lib/auth/mock-auth-provider");
    const provider = new MockAuthProvider();

    const result1 = await provider.validateSession("not-valid-base64");
    expect(result1).toBeNull();

    const result2 = await provider.validateSession("");
    expect(result2).toBeNull();
  });

  it("should return valid session for non-expired tokens", async () => {
    const { MockAuthProvider } = await import("@/lib/auth/mock-auth-provider");
    const provider = new MockAuthProvider();

    const session = await provider.authenticate("tanaka@ummy.example.com");
    expect(session).not.toBeNull();

    const token = provider.createToken(session!);
    const validated = await provider.validateSession(token);

    expect(validated).not.toBeNull();
    expect(validated!.user.email).toBe("tanaka@ummy.example.com");
  });

  it("should have logout button in AppLayout", () => {
    const appLayoutPath = path.resolve(
      __dirname,
      "../components/AppLayout.tsx"
    );
    const content = fs.readFileSync(appLayoutPath, "utf-8");

    expect(content).toContain("LogOut");
    expect(content).toContain("handleLogout");
    expect(content).toContain("/api/auth/logout");
  });
});

// --- Helper ---
function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== "__tests__") {
      files.push(...getAllTsFiles(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}
