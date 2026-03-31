/**
 * Search Integration Tests
 * Tests for search functionality.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0015: AC-1 (Posts), AC-2 (Communities), AC-3 (OrderingAndEmpty)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock useRouter, useSearchParams, and usePathname
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  useSearchParams: vi.fn(() => ({
    get: vi.fn(() => null),
  })),
  usePathname: vi.fn(() => "/"),
}));

// Mock AuthContext for AppLayout tests
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

// Story-0015: AC-1 Post Search
describe("Search / Posts", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should search posts by keyword and display results (AC-1)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: "post-1",
            content: "GraphQLについて学んでいます",
            excerpt: "GraphQLについて学んでいます",
            author: { id: "u1", name: "田中 太郎", avatar: "/avatar.jpg" },
            community: { id: "c1", name: "エンジニアリング", icon: "💻" },
            createdAt: new Date().toISOString(),
          },
        ],
        communities: [],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const SearchPage = (await import("@/app/search/page")).default;
    render(<SearchPage />);

    // Enter search query
    const input = screen.getByPlaceholderText("投稿やコミュニティを検索...");
    fireEvent.change(input, { target: { value: "GraphQL" } });
    fireEvent.submit(input.closest("form")!);

    // AC-1: Post results should be displayed
    await waitFor(() => {
      expect(screen.getByText("GraphQLについて学んでいます")).toBeInTheDocument();
    });

    // AC-1: Author name should be displayed
    expect(screen.getByText("田中 太郎")).toBeInTheDocument();

    // AC-1: Community should be displayed
    expect(screen.getByText(/エンジニアリング/)).toBeInTheDocument();
  });

  it("should normalize search query (NFKC, case-insensitive) (AC-1)", async () => {
    const { SearchService } = await import("@/lib/services/search-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create test data with unique keyword
    await repos.users.create({
      id: "test-u1",
      email: "test-unique@example.com",
      name: "Test User",
      avatar: "/test.png",
      role: "",
      createdAt: new Date(),
    });
    await repos.communities.create({
      name: "UniqueTestCommunity",
      slug: "unique-test",
      icon: "🧪",
      description: "Unique test community",
    });
    const communities = await repos.communities.findAll();
    const community = communities.find((c) => c.slug === "unique-test")!;
    await repos.posts.create({
      communityId: community.id,
      authorId: "test-u1",
      content: "XYZABC123UNIQUE is great for APIs",
    });

    const service = new SearchService(repos);

    // Search with lowercase (unique keyword)
    const result = await service.search("xyzabc123unique");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.posts.length).toBe(1);
    }

    // Search with full-width characters (NFKC normalization)
    const result2 = await service.search("ＸＹＺＡＢＣ１２３ＵＮＩＱＵＥ");
    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data.posts.length).toBe(1);
    }
  });
});

// Story-0015: AC-2 Community Search
describe("Search / Communities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should search communities by name and display results (AC-2)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [],
        communities: [
          {
            id: "c1",
            name: "エンジニアリング",
            slug: "engineering",
            icon: "💻",
            description: "技術者のためのコミュニティ",
            memberCount: 150,
            createdAt: new Date().toISOString(),
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const SearchPage = (await import("@/app/search/page")).default;
    render(<SearchPage />);

    const input = screen.getByPlaceholderText("投稿やコミュニティを検索...");
    fireEvent.change(input, { target: { value: "エンジニア" } });
    fireEvent.submit(input.closest("form")!);

    // AC-2: Community results should be displayed
    await waitFor(() => {
      expect(screen.getByText("エンジニアリング")).toBeInTheDocument();
    });

    // AC-2: Description should be displayed
    expect(screen.getByText("技術者のためのコミュニティ")).toBeInTheDocument();

    // AC-2: Member count should be displayed
    expect(screen.getByText("150人のメンバー")).toBeInTheDocument();
  });

  it("should search communities by description (AC-2)", async () => {
    const { SearchService } = await import("@/lib/services/search-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    await repos.communities.create({
      name: "Tech Talk",
      slug: "tech-talk",
      icon: "💬",
      description: "Discuss cutting-edge technologies",
    });

    const service = new SearchService(repos);

    // Search by description
    const result = await service.search("cutting-edge");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.communities.length).toBe(1);
      expect(result.data.communities[0].name).toBe("Tech Talk");
    }
  });
});

// Story-0015: AC-3 Ordering and Empty State
describe("Search / OrderingAndEmpty", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display empty state when no results (AC-3)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [],
        communities: [],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const SearchPage = (await import("@/app/search/page")).default;
    render(<SearchPage />);

    const input = screen.getByPlaceholderText("投稿やコミュニティを検索...");
    fireEvent.change(input, { target: { value: "存在しないキーワード" } });
    fireEvent.submit(input.closest("form")!);

    // AC-3: Empty state should be displayed
    await waitFor(() => {
      expect(screen.getByText("該当結果はありません")).toBeInTheDocument();
    });
  });

  it("should order posts by newest first (AC-3)", async () => {
    const { SearchService } = await import("@/lib/services/search-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create test data with different timestamps
    await repos.users.create({
      id: "u1",
      email: "test@example.com",
      name: "Test User",
      avatar: "/test.png",
      role: "",
      createdAt: new Date(),
    });
    await repos.communities.create({
      name: "Test",
      slug: "test",
      icon: "🧪",
      description: "Test community",
    });
    const community = (await repos.communities.findAll())[0];

    // Create posts (older first)
    await repos.posts.create({
      communityId: community.id,
      authorId: "u1",
      content: "First post about testing",
    });

    // Small delay to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10));

    await repos.posts.create({
      communityId: community.id,
      authorId: "u1",
      content: "Second post about testing",
    });

    const service = new SearchService(repos);
    const result = await service.search("testing");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.posts.length).toBe(2);
      // AC-3: Newest first
      expect(result.data.posts[0].content).toContain("Second post");
      expect(result.data.posts[1].content).toContain("First post");
    }
  });

  it("should order communities by newest first (AC-3)", async () => {
    const { SearchService } = await import("@/lib/services/search-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create communities
    await repos.communities.create({
      name: "First Tech Community",
      slug: "first-tech",
      icon: "1️⃣",
      description: "Tech discussions",
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    await repos.communities.create({
      name: "Second Tech Community",
      slug: "second-tech",
      icon: "2️⃣",
      description: "More tech discussions",
    });

    const service = new SearchService(repos);
    const result = await service.search("tech");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.communities.length).toBe(2);
      // AC-3: Newest first
      expect(result.data.communities[0].name).toBe("Second Tech Community");
      expect(result.data.communities[1].name).toBe("First Tech Community");
    }
  });
});

// Story-0015: Service-level Tests
describe("Search / ServiceLevel", () => {
  it("should return empty results for empty query", async () => {
    const { SearchService } = await import("@/lib/services/search-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    const service = new SearchService(repos);

    const result = await service.search("");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.posts.length).toBe(0);
      expect(result.data.communities.length).toBe(0);
    }

    const result2 = await service.search("   ");
    expect(result2.success).toBe(true);
    if (result2.success) {
      expect(result2.data.posts.length).toBe(0);
      expect(result2.data.communities.length).toBe(0);
    }
  });

  it("should search both posts and communities in single query", async () => {
    const { SearchService } = await import("@/lib/services/search-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create user with unique ID
    await repos.users.create({
      id: "combo-test-u1",
      email: "combo-test@example.com",
      name: "Test User",
      avatar: "/test.png",
      role: "",
      createdAt: new Date(),
    });

    // Create community with unique keyword
    await repos.communities.create({
      name: "ZYXWVU987 Enthusiasts",
      slug: "zyxwvu987",
      icon: "📊",
      description: "For ZYXWVU987 lovers",
    });
    const communities = await repos.communities.findAll();
    const community = communities.find((c) => c.slug === "zyxwvu987")!;

    // Create post with same unique keyword
    await repos.posts.create({
      communityId: community.id,
      authorId: "combo-test-u1",
      content: "Learning ZYXWVU987 today",
    });

    const service = new SearchService(repos);
    const result = await service.search("ZYXWVU987");

    expect(result.success).toBe(true);
    if (result.success) {
      // Should find both post and community
      expect(result.data.posts.length).toBe(1);
      expect(result.data.communities.length).toBe(1);
    }
  });
});

// Story-0015: URL State Sync and Navigation
describe("Search / URLStateSync", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should auto-search when initial query parameter exists", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: [
          {
            id: "post-1",
            content: "テスト投稿",
            excerpt: "テスト投稿",
            author: { id: "u1", name: "テストユーザー", avatar: "/avatar.jpg" },
            community: { id: "c1", name: "テストコミュニティ", icon: "🧪" },
            createdAt: new Date().toISOString(),
          },
        ],
        communities: [],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    // Mock useSearchParams to return initial query
    const { useSearchParams } = await import("next/navigation");
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key) => (key === "q" ? "テスト" : null)),
    } as ReturnType<typeof useSearchParams>);

    const SearchPage = (await import("@/app/search/page")).default;
    render(<SearchPage />);

    // Should auto-search without user interaction
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/api/search?q=")
      );
    });

    // Results should be displayed
    await waitFor(() => {
      expect(screen.getByText("テスト投稿")).toBeInTheDocument();
    });
  });

  it("should navigate to search page from AppLayout search bar", async () => {
    const mockPush = vi.fn();
    const { useRouter } = await import("next/navigation");
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as ReturnType<typeof useRouter>);

    const { AppLayout } = await import("@/components/AppLayout");
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    // Find search input and enter query
    const searchInput = screen.getByPlaceholderText("Ummyを検索");
    fireEvent.change(searchInput, { target: { value: "検索キーワード" } });
    fireEvent.submit(searchInput.closest("form")!);

    // Should navigate to search page with query
    expect(mockPush).toHaveBeenCalledWith(
      "/search?q=%E6%A4%9C%E7%B4%A2%E3%82%AD%E3%83%BC%E3%83%AF%E3%83%BC%E3%83%89"
    );
  });
});
