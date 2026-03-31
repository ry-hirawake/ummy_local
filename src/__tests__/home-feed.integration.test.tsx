/**
 * Home Feed Integration Tests
 * Tests for home feed functionality including post display, reactions, and comments.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0001: AC-1 to AC-5
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";

// Mock AuthContext
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

// Mock API posts data matching the old mockPosts structure
const mockApiPosts = [
  {
    id: "1",
    content:
      "新しい製品ローンチキャンペーンが大成功を収めました！チーム全員の努力のおかげです。素晴らしい結果を達成できたことを誇りに思います \n\n主な成果：\n✅ 目標の150%達成\n✅ 新規顧客獲得数が過去最高\n✅ SNSエンゲージメント300%増加\n\nみなさんの協力に感謝します！",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
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
  {
    id: "2",
    content:
      "今日のテックトークセッション「新しいアーキテクチャパターン」にご参加いただきありがとうございました！",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    author: {
      id: "u2",
      name: "佐藤 健太",
      role: "シニアデベロッパー",
      avatar: "https://example.com/avatar2.jpg",
    },
    reactions: { thumbsUp: 18, partyPopper: 5, lightbulb: 8, laugh: 1 },
    commentCount: 12,
    userReaction: "lightbulb",
    community: { name: "エンジニアリング", icon: "💻" },
  },
  {
    id: "3",
    content: "新しいUIデザインシステムのプロトタイプが完成しました！ 🎨",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    author: {
      id: "u3",
      name: "鈴木 愛",
      role: "プロダクトデザイナー",
      avatar: "https://example.com/avatar3.jpg",
    },
    reactions: { thumbsUp: 30, partyPopper: 15, lightbulb: 9, laugh: 2 },
    commentCount: 15,
    community: { name: "デザイン", icon: "🎨" },
  },
];

// Feature: Home Feed Architecture
describe("HomeFeed / Architecture", () => {
  it("should have types defined in separate module", async () => {
    const typesPath = path.resolve(__dirname, "../types/post.ts");
    expect(fs.existsSync(typesPath)).toBe(true);

    const { mockPosts } = await import("@/lib/mock-data");
    expect(Array.isArray(mockPosts)).toBe(true);
    expect(mockPosts.length).toBeGreaterThan(0);
  });

  it("should have mock data in separate module", async () => {
    const mockDataPath = path.resolve(__dirname, "../lib/mock-data.ts");
    expect(fs.existsSync(mockDataPath)).toBe(true);

    const { mockPosts, currentUserAvatar } = await import("@/lib/mock-data");
    expect(Array.isArray(mockPosts)).toBe(true);
    expect(typeof currentUserAvatar).toBe("string");
  });

  it("should not contain inline type definitions in page component", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).not.toMatch(/^interface Comment \{/m);
    expect(pageContent).not.toMatch(/^interface Post \{/m);
    expect(pageContent).toMatch(/from "@\/types\/post"/);
    expect(pageContent).toMatch(/from "@\/lib\/mock-data"/);
  });

  it("should use Presentational Components", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).toMatch(/from "@\/components\/home"/);
    expect(pageContent).toMatch(/<PostCard/);
  });
});

// Feature: Home Feed Display
describe("HomeFeed / PostDisplay", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should render posts with author info and timestamp", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });
    expect(screen.getByText("マーケティングマネージャー")).toBeInTheDocument();
    expect(screen.getByText("2時間前")).toBeInTheDocument();
  });

  it("should render community name for posts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("📊 マーケティング")).toBeInTheDocument();
    });
    expect(screen.getByText("💻 エンジニアリング")).toBeInTheDocument();
  });

  it("should render posts in correct order", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(3);
    expect(articles[0]).toHaveTextContent("田中 美咲");
    expect(articles[1]).toHaveTextContent("佐藤 健太");
    expect(articles[2]).toHaveTextContent("鈴木 愛");
  });
});

// Feature: Reactions
describe("HomeFeed / Reactions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should show reaction popup when button is clicked", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    expect(screen.getByTitle("いいね")).toBeInTheDocument();
    expect(screen.getByTitle("祝福")).toBeInTheDocument();
    expect(screen.getByTitle("ひらめき")).toBeInTheDocument();
    expect(screen.getByTitle("笑")).toBeInTheDocument();
  });

  it("should update display when reaction is selected", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    const likeButton = screen.getByTitle("いいね");
    fireEvent.click(likeButton);

    expect(screen.getAllByText("いいね").length).toBeGreaterThan(0);
  });

  it("should display pre-existing user reaction", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    // Post 2 has userReaction: "lightbulb"
    expect(screen.getByText("ひらめき")).toBeInTheDocument();
  });
});

// Feature: Comments (Note: Comments from API are not yet supported, testing basic behavior)
describe("HomeFeed / Comments", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should show comment button for each post", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    const commentButtons = screen.getAllByText("コメント");
    expect(commentButtons.length).toBe(3);
  });
});

// Feature: Image Optimization
describe("HomeFeed / ImageOptimization", () => {
  it("should not use img tags in page component", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    expect(pageContent).not.toMatch(/<img\s/);
  });

  it("should use next/image in PostCard component", () => {
    const componentPath = path.resolve(
      __dirname,
      "../components/home/PostCard.tsx"
    );
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).toMatch(/<Image/);
    expect(componentContent).not.toMatch(/<img\s/);
  });

  it("should use next/image in CommentItem component", () => {
    const componentPath = path.resolve(
      __dirname,
      "../components/home/CommentItem.tsx"
    );
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).toMatch(/<Image/);
    expect(componentContent).not.toMatch(/<img\s/);
  });
});

// Feature: Loading and Error States
describe("HomeFeed / LoadingAndError", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should show loading skeleton while fetching", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise(() => {})) // Never resolves
    );

    const Home = (await import("@/app/page")).default;
    const { container } = render(<Home />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });

  it("should show error message and retry button on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("投稿の取得に失敗しました")).toBeInTheDocument();
    });

    expect(screen.getByText("再試行")).toBeInTheDocument();
  });
});
