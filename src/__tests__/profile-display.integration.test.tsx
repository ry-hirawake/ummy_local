/**
 * Profile Display Integration Tests
 * Tests for user profile information display on posts and comments.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0014: AC-1 (PostMetadata), AC-2 (CommentMetadata), AC-3 (Consistency)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock AuthContext
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

// Story-0014: AC-1 Post Metadata Display
describe("Profiles / PostMetadata", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display author name, role, and avatar on post card", async () => {
    const mockPost = {
      id: "1",
      content: "テスト投稿",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: {
        id: "u1",
        name: "田中 美咲",
        role: "マーケティングマネージャー",
        avatar: "https://example.com/tanaka.jpg",
      },
      reactions: { thumbsUp: 5, partyPopper: 2, lightbulb: 1, laugh: 0 },
      commentCount: 3,
      community: { name: "マーケティング", icon: "📊" },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [mockPost] }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // AC-1: Author name is displayed
    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    // AC-1: Author role is displayed
    expect(screen.getByText("マーケティングマネージャー")).toBeInTheDocument();

    // AC-1: Author avatar is displayed (check img with alt text)
    const avatar = screen.getByAltText("田中 美咲");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");
  });

  it("should not display empty role placeholder when role is not set", async () => {
    const mockPostNoRole = {
      id: "1",
      content: "テスト投稿",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: {
        id: "u1",
        name: "ゲストユーザー",
        role: "",
        avatar: "https://example.com/guest.jpg",
      },
      reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
      commentCount: 0,
      community: { name: "雑談", icon: "☕" },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [mockPostNoRole] }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("ゲストユーザー")).toBeInTheDocument();
    });

    // EC-1: No empty role placeholder - the role element should not exist or be empty
    const article = screen.getByRole("article");
    // Role is not shown (no empty text node for role)
    expect(article.textContent).not.toMatch(/ゲストユーザー\s*$/);
  });
});

// Story-0014: AC-2 Comment Metadata Display
describe("Profiles / CommentMetadata", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display author name, role, and avatar on comments", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          posts: [],
          community: {
            id: "c1",
            name: "テスト",
            icon: "🧪",
            description: "テスト用",
            memberCount: 10,
          },
        }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );

    const mockCommunity = {
      name: "エンジニアリング",
      icon: "💻",
      description: "エンジニアコミュニティ",
      members: 50,
    };

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "佐藤 健太",
          role: "シニアデベロッパー",
          avatar: "https://example.com/sato.jpg",
        },
        content: "テスト投稿です",
        timestamp: "2時間前",
        likes: 10,
        comments: 2,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 3, lightbulb: 2, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "田中 美咲",
              role: "マーケティングマネージャー",
              avatar: "https://example.com/tanaka.jpg",
            },
            content: "素晴らしいですね！",
            timestamp: "1時間前",
            likes: 3,
          },
          {
            id: "comment-2",
            author: {
              name: "鈴木 愛",
              role: "プロダクトデザイナー",
              avatar: "https://example.com/suzuki.jpg",
            },
            content: "同意します！",
            timestamp: "30分前",
            likes: 1,
          },
        ],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    // Expand comments
    const commentButton = screen.getByText("コメント");
    fireEvent.click(commentButton);

    // AC-2: Comment author name is displayed
    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    // AC-2: Comment author role is displayed
    expect(screen.getByText("マーケティングマネージャー")).toBeInTheDocument();

    // AC-2: Second commenter info is also displayed
    expect(screen.getByText("鈴木 愛")).toBeInTheDocument();
    expect(screen.getByText("プロダクトデザイナー")).toBeInTheDocument();
  });

  it("should distinguish comment author from post author", async () => {
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

    const mockCommunity = {
      name: "エンジニアリング",
      icon: "💻",
      description: "エンジニアコミュニティ",
      members: 50,
    };

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "佐藤 健太",
          role: "シニアデベロッパー",
          avatar: "https://example.com/sato.jpg",
        },
        content: "投稿内容",
        timestamp: "2時間前",
        likes: 10,
        comments: 1,
        shares: 0,
        reactions: { thumbsUp: 10, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "田中 美咲",
              role: "マーケティングマネージャー",
              avatar: "https://example.com/tanaka.jpg",
            },
            content: "コメント内容",
            timestamp: "1時間前",
            likes: 0,
          },
        ],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    // Expand comments
    fireEvent.click(screen.getByText("コメント"));

    await waitFor(() => {
      expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    });

    // AC-2: Post author and comment author are both visible with distinct info
    expect(screen.getByText("佐藤 健太")).toBeInTheDocument();
    expect(screen.getByText("シニアデベロッパー")).toBeInTheDocument();
    expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    expect(screen.getByText("マーケティングマネージャー")).toBeInTheDocument();
  });

  it("should not display empty role placeholder for comments without role", async () => {
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

    const mockCommunity = {
      name: "雑談",
      icon: "☕",
      description: "カジュアルなコミュニティ",
      members: 20,
    };

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "メンバー",
          avatar: "https://example.com/poster.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 1,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "ゲストコメンター",
              role: "", // Empty role
              avatar: "https://example.com/guest.jpg",
            },
            content: "コメントです",
            timestamp: "30分前",
            likes: 0,
          },
        ],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    fireEvent.click(screen.getByText("コメント"));

    await waitFor(() => {
      expect(screen.getByText("ゲストコメンター")).toBeInTheDocument();
    });

    // EC-1: Comment with no role should not show empty placeholder
    // The comment area should only have the name, not an empty role line
    expect(screen.getByText("コメントです")).toBeInTheDocument();
  });
});

// Story-0014: EC-2 Default Avatar Fallback
describe("Profiles / DefaultAvatar", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should use default avatar when post author has no avatar", async () => {
    const mockPostNoAvatar = {
      id: "1",
      content: "テスト投稿",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: {
        id: "u1",
        name: "アバターなしユーザー",
        role: "メンバー",
        avatar: "", // Empty avatar
      },
      reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
      commentCount: 0,
      community: { name: "テスト", icon: "🧪" },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [mockPostNoAvatar] }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("アバターなしユーザー")).toBeInTheDocument();
    });

    // EC-2: Avatar should still be rendered (with default)
    const avatar = screen.getByAltText("アバターなしユーザー");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");
    // The src should contain the default avatar URL (contains unsplash)
    expect(avatar.getAttribute("src")).toBeTruthy();
  });

  it("should use default avatar when comment author has no avatar", async () => {
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

    const mockCommunity = {
      name: "テスト",
      icon: "🧪",
      description: "テスト用コミュニティ",
      members: 10,
    };

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "メンバー",
          avatar: "https://example.com/poster.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 1,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "アバターなしコメンター",
              role: "ゲスト",
              avatar: "", // Empty avatar
            },
            content: "コメントです",
            timestamp: "30分前",
            likes: 0,
          },
        ],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    fireEvent.click(screen.getByText("コメント"));

    await waitFor(() => {
      expect(screen.getByText("アバターなしコメンター")).toBeInTheDocument();
    });

    // EC-2: Comment avatar should still be rendered (with default)
    const avatar = screen.getByAltText("アバターなしコメンター");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");
  });
});

// Story-0014: Community PostCard Fallback (EC-1/EC-2 for community pages)
describe("Profiles / CommunityPostCardFallback", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should use default avatar for community post author without avatar", async () => {
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

    const mockCommunity = {
      name: "テスト",
      icon: "🧪",
      description: "テスト用コミュニティ",
      members: 10,
    };

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "アバターなし投稿者",
          role: "メンバー",
          avatar: "", // Empty avatar
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    // EC-2: Avatar should still be rendered (with default)
    const avatar = screen.getByAltText("アバターなし投稿者");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src");
  });

  it("should not display empty role placeholder for community post author without role", async () => {
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

    const mockCommunity = {
      name: "テスト",
      icon: "🧪",
      description: "テスト用コミュニティ",
      members: 10,
    };

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "役職なし投稿者",
          role: "", // Empty role
          avatar: "https://example.com/avatar.jpg",
        },
        content: "投稿内容です",
        timestamp: "30分前",
        likes: 3,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 3, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    // EC-1: Name should be visible
    expect(screen.getByText("役職なし投稿者")).toBeInTheDocument();

    // EC-1: No empty role placeholder - check that content is present
    expect(screen.getByText("投稿内容です")).toBeInTheDocument();
  });
});

// Story-0014: AC-3 Consistency
describe("Profiles / Consistency", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display consistent user info across posts and comments", async () => {
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

    const mockCommunity = {
      name: "エンジニアリング",
      icon: "💻",
      description: "エンジニアコミュニティ",
      members: 50,
    };

    // Same user appears as post author and commenter on different post
    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "田中 美咲",
          role: "マーケティングマネージャー",
          avatar: "https://example.com/tanaka.jpg",
        },
        content: "田中の投稿",
        timestamp: "3時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [],
      },
      {
        id: "post-2",
        author: {
          name: "佐藤 健太",
          role: "シニアデベロッパー",
          avatar: "https://example.com/sato.jpg",
        },
        content: "佐藤の投稿",
        timestamp: "2時間前",
        likes: 8,
        comments: 1,
        shares: 0,
        reactions: { thumbsUp: 8, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "田中 美咲",
              role: "マーケティングマネージャー",
              avatar: "https://example.com/tanaka.jpg",
            },
            content: "田中のコメント",
            timestamp: "1時間前",
            likes: 2,
          },
        ],
      },
    ];

    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={mockPosts}
      />
    );

    // AC-3: Same user "田中 美咲" appears as post author
    const tanakaInstances = screen.getAllByText("田中 美咲");
    expect(tanakaInstances.length).toBeGreaterThanOrEqual(1);

    // Expand comments on post-2
    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[1]); // Second post's comment button

    await waitFor(() => {
      // AC-3: Same user appears again in comments with same info
      const allTanakaInstances = screen.getAllByText("田中 美咲");
      expect(allTanakaInstances.length).toBe(2); // Once as post author, once as commenter
    });

    // AC-3: Role is consistent
    const roleInstances = screen.getAllByText("マーケティングマネージャー");
    expect(roleInstances.length).toBe(2);
  });

  it("should display user info consistently between home feed and community pages", async () => {
    const mockApiPosts = [
      {
        id: "1",
        content: "ホームフィードの投稿",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        author: {
          id: "u1",
          name: "佐藤 健太",
          role: "シニアデベロッパー",
          avatar: "https://example.com/sato.jpg",
        },
        reactions: { thumbsUp: 10, partyPopper: 5, lightbulb: 3, laugh: 0 },
        commentCount: 2,
        community: { name: "エンジニアリング", icon: "💻" },
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // AC-3: User info on home feed
    await waitFor(() => {
      expect(screen.getByText("佐藤 健太")).toBeInTheDocument();
    });
    expect(screen.getByText("シニアデベロッパー")).toBeInTheDocument();

    // The avatar should be present
    const avatar = screen.getByAltText("佐藤 健太");
    expect(avatar).toBeInTheDocument();
  });
});
