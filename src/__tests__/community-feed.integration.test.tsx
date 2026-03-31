/**
 * Community Feed Integration Tests
 * Tests for community detail page functionality including display, reactions, comments, and architecture.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0003: AC-1 to AC-5
 * - Story-0011: AC-1 to AC-3 (DataBackedDisplay, ChronologicalOrder, EmptyState)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { resetRepositories } from "@/lib/repositories";
import { getServices, resetServices } from "@/lib/services";

// Mock session for authenticated tests (user-1 = 田中 美咲)
vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(() =>
    Promise.resolve({
      user: {
        id: "user-1",
        email: "tanaka@ummy.example.com",
        name: "田中 美咲",
        avatar: "https://example.com/avatar.jpg",
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    })
  ),
  setSessionCookie: vi.fn(),
  deleteSessionCookie: vi.fn(),
}));

async function renderCommunityPage(id = "community-1"): Promise<void> {
  const CommunityPage = (await import("@/app/community/[id]/page")).default;
  const element = await CommunityPage({
    params: Promise.resolve({ id }),
  });

  render(element);
}

// Feature: Community Feed Architecture (AC-1)
describe("CommunityFeed / Architecture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetServices();
    resetRepositories();
  });

  it("should have community types defined in _data module", async () => {
    const typesPath = path.resolve(__dirname, "../app/community/[id]/_data/types.ts");
    expect(fs.existsSync(typesPath)).toBe(true);

    expect(true).toBe(true);
  });

  it("should have community data in _data module", async () => {
    const dataPath = path.resolve(__dirname, "../app/community/[id]/_data/community-data.ts");
    expect(fs.existsSync(dataPath)).toBe(true);

    const { communityData, getCommunityById } = await import(
      "@/app/community/[id]/_data/community-data"
    );
    expect(typeof communityData).toBe("object");
    expect(typeof getCommunityById).toBe("function");
    expect(getCommunityById("1")).toBeDefined();
  });

  it("should have mock posts in _data module", async () => {
    const mockPath = path.resolve(__dirname, "../app/community/[id]/_data/mock-posts.ts");
    expect(fs.existsSync(mockPath)).toBe(true);

    const { mockCommunityPosts, currentUserAvatar } = await import(
      "@/app/community/[id]/_data/mock-posts"
    );
    expect(Array.isArray(mockCommunityPosts)).toBe(true);
    expect(mockCommunityPosts.length).toBeGreaterThan(0);
    expect(typeof currentUserAvatar).toBe("string");
  });

  it("should not contain inline type definitions in client container", () => {
    const pagePath = path.resolve(
      __dirname,
      "../app/community/[id]/CommunityPageClient.tsx"
    );
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).not.toMatch(/^interface Comment \{/m);
    expect(pageContent).not.toMatch(/^interface CommunityPost \{/m);
    expect(pageContent).not.toMatch(/^const communityData/m);
    expect(pageContent).not.toMatch(/^const mockCommunityPosts/m);
    expect(pageContent).toMatch(/from ".\/_data"/);
  });

  it("should use Presentational Components", () => {
    const pagePath = path.resolve(
      __dirname,
      "../app/community/[id]/CommunityPageClient.tsx"
    );
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).toMatch(/from ".\/_components"/);
    expect(pageContent).toMatch(/<CommunityHeader/);
    expect(pageContent).toMatch(/<CommunityPostCard/);
    expect(pageContent).toMatch(/<CreatePostInput/);
  });

  it("should resolve community data through service layer in page entry", () => {
    const pagePath = path.resolve(__dirname, "../app/community/[id]/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).toMatch(/from "@\/lib\/services"/);
    expect(pageContent).toMatch(/<CommunityPageClient/);
    expect(pageContent).toMatch(/notFound\(\)/);
  });

  it("should reuse shared reaction icons from lib", () => {
    const componentPath = path.resolve(
      __dirname,
      "../app/community/[id]/_components/CommunityPostCard.tsx"
    );
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/from "@\/lib\/reactions"/);
  });
});

// Feature: Community Feed Display (AC-2)
describe("CommunityFeed / Display", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetServices();
    resetRepositories();
  });

  it("should render community info header", async () => {
    await renderCommunityPage();

    expect(screen.getByText("全社アナウンス")).toBeInTheDocument();
    expect(screen.getByText("3人のメンバー")).toBeInTheDocument();
    expect(
      screen.getByText("会社からの重要なお知らせや全社に関わる情報を共有するコミュニティです")
    ).toBeInTheDocument();
  });

  it("should render posts with author info and timestamp", async () => {
    await renderCommunityPage();

    expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    expect(screen.getByText("マーケティングマネージャー")).toBeInTheDocument();
    expect(screen.getByText("1時間前")).toBeInTheDocument();
  });

  it("should display pinned post with indicator at top", async () => {
    await renderCommunityPage();

    expect(screen.getByText("ピン留めされた投稿")).toBeInTheDocument();

    const articles = screen.getAllByRole("article");
    expect(articles[0]).toHaveTextContent("ピン留めされた投稿");
    expect(articles[0]).toHaveTextContent("田中 美咲");
  });

  it("should render posts in mock data order", async () => {
    await renderCommunityPage();

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(3);
    expect(articles[0]).toHaveTextContent("田中 美咲");
    expect(articles[1]).toHaveTextContent("佐藤 健太");
    expect(articles[2]).toHaveTextContent("鈴木 愛");
  });

  it("should render a newly created community by generated id", async () => {
    const services = getServices();
    const result = await services.communities.create(
      {
        name: "SRE",
        icon: "🛠️",
        description: "運用と信頼性を扱うコミュニティ",
      },
      "user-1"
    );

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    await renderCommunityPage(result.data.id);

    expect(screen.getByText("SRE")).toBeInTheDocument();
    expect(screen.getByText("1人のメンバー")).toBeInTheDocument();
    expect(screen.getByText("運用と信頼性を扱うコミュニティ")).toBeInTheDocument();
  });
});

// Feature: Reactions and Comments Interactions (AC-3)
describe("CommunityFeed / Interactions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetServices();
    resetRepositories();
  });

  it("should show reaction popup when button is clicked", async () => {
    await renderCommunityPage();

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    expect(screen.getByTitle("いいね")).toBeInTheDocument();
    expect(screen.getByTitle("祝福")).toBeInTheDocument();
    expect(screen.getByTitle("ひらめき")).toBeInTheDocument();
    expect(screen.getByTitle("笑")).toBeInTheDocument();
  });

  it("should update display when reaction is selected", async () => {
    await renderCommunityPage();

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    const likeButton = screen.getByTitle("いいね");
    fireEvent.click(likeButton);

    expect(screen.getAllByText("いいね").length).toBeGreaterThan(0);
  });

  it("should close popup after reaction selection", async () => {
    await renderCommunityPage();

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    expect(screen.getByTitle("いいね")).toBeInTheDocument();

    const likeButton = screen.getByTitle("いいね");
    fireEvent.click(likeButton);

    expect(screen.queryByTitle("祝福")).not.toBeInTheDocument();
  });

  it("should display pre-existing user reaction", async () => {
    await renderCommunityPage();

    expect(screen.getByText("ひらめき")).toBeInTheDocument();
  });

  it("should expand comments when button is clicked", async () => {
    await renderCommunityPage();

    expect(
      screen.queryByText("Zoomリンクはいつ頃共有される予定でしょうか？カレンダーに登録しておきたいです。")
    ).not.toBeInTheDocument();

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    expect(
      screen.getByText("Zoomリンクはいつ頃共有される予定でしょうか？カレンダーに登録しておきたいです。")
    ).toBeInTheDocument();
  });

  it("should show reply input when reply button is clicked", async () => {
    await renderCommunityPage();

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    const replyButtons = screen.getAllByText("返信");
    fireEvent.click(replyButtons[0]);

    expect(screen.getByPlaceholderText("返信を入力...")).toBeInTheDocument();
  });

  it("should toggle reply input off when clicked again", async () => {
    await renderCommunityPage();

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    const replyButtons = screen.getAllByText("返信");
    fireEvent.click(replyButtons[0]);
    expect(screen.getByPlaceholderText("返信を入力...")).toBeInTheDocument();

    fireEvent.click(replyButtons[0]);
    expect(screen.queryByPlaceholderText("返信を入力...")).not.toBeInTheDocument();
  });
});

// Feature: Invalid Community ID Handling (AC-4)
describe("CommunityFeed / InvalidCommunity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetServices();
    resetRepositories();
  });

  it("should have not-found.tsx file", () => {
    const notFoundPath = path.resolve(__dirname, "../app/community/[id]/not-found.tsx");
    expect(fs.existsSync(notFoundPath)).toBe(true);
  });

  it("should call notFound for invalid community ID", async () => {
    vi.mocked(notFound).mockImplementation(() => {
      throw new Error("NEXT_NOT_FOUND");
    });

    const CommunityPage = (await import("@/app/community/[id]/page")).default;

    await expect(
      CommunityPage({ params: Promise.resolve({ id: "community-999" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("should use notFound() from next/navigation in page", () => {
    const pagePath = path.resolve(__dirname, "../app/community/[id]/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).toMatch(/import.*notFound.*from "next\/navigation"/);
    expect(pageContent).toMatch(/notFound\(\)/);
  });
});

// Feature: Image Optimization (AC-5)
describe("CommunityFeed / ImageOptimization", () => {
  it("should not use img tags in page component", () => {
    const pagePath = path.resolve(__dirname, "../app/community/[id]/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).not.toMatch(/<img\s/);
  });

  it("should not use img tags in client container", () => {
    const pagePath = path.resolve(
      __dirname,
      "../app/community/[id]/CommunityPageClient.tsx"
    );
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).not.toMatch(/<img\s/);
  });

  it("should use next/image in CommunityPostCard component", () => {
    const componentPath = path.resolve(
      __dirname,
      "../app/community/[id]/_components/CommunityPostCard.tsx"
    );
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).toMatch(/<Image/);
    expect(componentContent).not.toMatch(/<img\s/);
  });

  it("should use next/image in CreatePostInput component", () => {
    const componentPath = path.resolve(
      __dirname,
      "../app/community/[id]/_components/CreatePostInput.tsx"
    );
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).toMatch(/<Image/);
    expect(componentContent).not.toMatch(/<img\s/);
  });

  it("should reuse CommentItem which uses next/image", () => {
    const componentPath = path.resolve(__dirname, "../components/home/CommentItem.tsx");
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).not.toMatch(/<img\s/);
  });
});

// =============================================================================
// Story-0011: コミュニティ詳細で投稿フィードを時系列表示できる
// =============================================================================

// Mock AuthContext for client component tests
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

const mockCommunityForClientTests = {
  name: "テストコミュニティ",
  icon: "🧪",
  description: "テスト用コミュニティ",
  members: 10,
};

// Feature: Data-Backed Display (Story-0011 AC-1)
describe("CommunityFeed / DataBackedDisplay", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should fetch and display posts from API", async () => {
    const mockPosts = [
      {
        id: "p1",
        content: "APIからの投稿です",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: {
          id: "u1",
          name: "田中 太郎",
          role: "エンジニア",
          avatar: "/avatar1.png",
        },
        reactions: { thumbsUp: 5, partyPopper: 2, lightbulb: 1, laugh: 0 },
        commentCount: 3,
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // AC-1: Posts fetched from API are displayed
    await waitFor(() => {
      expect(screen.getByText("APIからの投稿です")).toBeInTheDocument();
    });

    // Verify API was called with correct endpoint
    expect(fetch).toHaveBeenCalledWith("/api/communities/c1/posts");
  });

  it("should display author information for each post", async () => {
    const mockPosts = [
      {
        id: "p1",
        content: "テスト投稿",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        author: {
          id: "u1",
          name: "佐藤 花子",
          role: "デザイナー",
          avatar: "/avatar.png",
        },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // AC-1: Author info displayed
    await waitFor(() => {
      expect(screen.getByText("佐藤 花子")).toBeInTheDocument();
    });
    expect(screen.getByText("デザイナー")).toBeInTheDocument();
  });

  it("should display timestamp for each post", async () => {
    const mockPosts = [
      {
        id: "p1",
        content: "タイムスタンプテスト",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        author: {
          id: "u1",
          name: "テスター",
          role: "QA",
          avatar: "/avatar.png",
        },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // AC-1: Timestamp displayed
    await waitFor(() => {
      expect(screen.getByText("3時間前")).toBeInTheDocument();
    });
  });

  it("should display posts with zero comments and reactions (EC-2)", async () => {
    const mockPosts = [
      {
        id: "p1",
        content: "ゼロカウントの投稿",
        createdAt: new Date().toISOString(),
        author: {
          id: "u1",
          name: "テスター",
          role: "QA",
          avatar: "/avatar.png",
        },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // EC-2: Post with zero counts should still render
    await waitFor(() => {
      expect(screen.getByText("ゼロカウントの投稿")).toBeInTheDocument();
    });
  });
});

// Feature: Chronological Order (Story-0011 AC-2)
describe("CommunityFeed / ChronologicalOrder", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display posts in newest-first order", async () => {
    const mockPosts = [
      {
        id: "p1",
        content: "最新の投稿",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
        author: { id: "u1", name: "ユーザー1", role: "役職", avatar: "/a.png" },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
      {
        id: "p2",
        content: "古い投稿",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
        author: { id: "u2", name: "ユーザー2", role: "役職", avatar: "/b.png" },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("最新の投稿")).toBeInTheDocument();
    });

    // AC-2: Posts are in newest-first order
    const articles = screen.getAllByRole("article");
    expect(articles[0]).toHaveTextContent("最新の投稿");
    expect(articles[1]).toHaveTextContent("古い投稿");
  });

  it("should display pinned post at the top", async () => {
    const mockPosts = [
      {
        id: "p1",
        content: "ピン留めされた古い投稿",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isPinned: true,
        author: { id: "u1", name: "ユーザー1", role: "役職", avatar: "/a.png" },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
      {
        id: "p2",
        content: "最新の通常投稿",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
        author: { id: "u2", name: "ユーザー2", role: "役職", avatar: "/b.png" },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
      {
        id: "p3",
        content: "古い通常投稿",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
        author: { id: "u3", name: "ユーザー3", role: "役職", avatar: "/c.png" },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockPosts }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("ピン留めされた古い投稿")).toBeInTheDocument();
    });

    // AC-2: Pinned post is at the top, then newest-first for regular posts
    const articles = screen.getAllByRole("article");
    expect(articles[0]).toHaveTextContent("ピン留めされた古い投稿");
    expect(articles[1]).toHaveTextContent("最新の通常投稿");
    expect(articles[2]).toHaveTextContent("古い通常投稿");
  });
});

// Feature: Empty State (Story-0011 AC-3)
describe("CommunityFeed / EmptyState", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display empty state message when no posts exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [] }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // AC-3: Empty state message displayed
    await waitFor(() => {
      expect(screen.getByText(/まだ投稿がありません/)).toBeInTheDocument();
    });
  });

  it("should show guidance for first post creation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [] }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // AC-3: Guidance for first post
    await waitFor(() => {
      expect(screen.getByText(/最初の投稿/)).toBeInTheDocument();
    });
  });
});

// Feature: Loading and Error States (Story-0011)
describe("CommunityFeed / LoadingAndError", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should show loading state while fetching", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise(() => {})) // Never resolves
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    const { container } = render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    // Loading skeleton should be visible
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("should show error message on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunityForClientTests}
        communityId="c1"
        initialMembership={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/取得に失敗しました/)).toBeInTheDocument();
    });
  });
});
