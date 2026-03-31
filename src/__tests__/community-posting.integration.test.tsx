/**
 * Community Posting Integration Tests
 * Tests for post creation within communities and home feed restrictions.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0009: AC-1 to AC-4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock AuthContext
const mockUser = {
  id: "u1",
  name: "テストユーザー",
  avatar: "/test.png",
  role: "エンジニア",
};
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}));

const mockCommunity = {
  name: "エンジニアリング",
  icon: "💻",
  description: "エンジニア向けコミュニティ",
  members: 89,
};

// Feature: Community Posting Create (AC-1)
describe("CommunityPosting / Create", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should create a post when valid content is submitted", async () => {
    const mockPost = {
      id: "p-new",
      authorId: "u1",
      communityId: "c1",
      content: "テスト投稿です",
      createdAt: new Date().toISOString(),
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ post: mockPost }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
      />
    );

    const textarea = screen.getByPlaceholderText(/エンジニアリングで共有/);
    fireEvent.change(textarea, { target: { value: "テスト投稿です" } });

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    fireEvent.click(submitButton);

    // AC-1: Post is created via API
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/communities/c1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "テスト投稿です" }),
      });
    });
  });

  it("should add the new post at the top of the feed after creation", async () => {
    const mockPost = {
      id: "p-new",
      authorId: "u1",
      communityId: "c1",
      content: "新しい投稿です",
      createdAt: new Date().toISOString(),
      author: mockUser,
      reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
      commentCount: 0,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ post: mockPost }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
      />
    );

    const textarea = screen.getByPlaceholderText(/エンジニアリングで共有/);
    fireEvent.change(textarea, { target: { value: "新しい投稿です" } });

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    fireEvent.click(submitButton);

    // AC-1: New post appears at the top of the feed
    await waitFor(() => {
      expect(screen.getByText("新しい投稿です")).toBeInTheDocument();
    });
  });

  it("should clear the input after successful post creation", async () => {
    const mockPost = {
      id: "p-new",
      authorId: "u1",
      communityId: "c1",
      content: "投稿内容",
      createdAt: new Date().toISOString(),
      author: mockUser,
      reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
      commentCount: 0,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ post: mockPost }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
      />
    );

    const textarea = screen.getByPlaceholderText(
      /エンジニアリングで共有/
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "投稿内容" } });

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    fireEvent.click(submitButton);

    // Input should be cleared after successful submission
    await waitFor(() => {
      expect(textarea.value).toBe("");
    });
  });
});

// Feature: Community Posting Home Restriction (AC-2)
describe("CommunityPosting / HomeRestriction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should not display post creation form on home feed", async () => {
    const HomePage = (await import("@/app/page")).default;
    render(<HomePage />);

    // AC-2: No post creation input on home feed
    expect(
      screen.queryByPlaceholderText(/で共有/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "投稿する" })
    ).not.toBeInTheDocument();
  });
});

// Feature: Community Posting Validation (AC-3)
describe("CommunityPosting / Validation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should disable submit button when content is empty", async () => {
    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[]}
      />
    );

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    // AC-3: Button is disabled when empty
    expect(submitButton).toBeDisabled();
  });

  it("should disable submit button when content is whitespace only", async () => {
    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[]}
      />
    );

    const textarea = screen.getByPlaceholderText(/エンジニアリングで共有/);
    fireEvent.change(textarea, { target: { value: "   " } });

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    // AC-3: Button is disabled when whitespace only
    expect(submitButton).toBeDisabled();
  });

  it("should show character count and error when exceeding 2000 characters", async () => {
    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[]}
      />
    );

    const textarea = screen.getByPlaceholderText(/エンジニアリングで共有/);
    const longText = "a".repeat(2001);
    fireEvent.change(textarea, { target: { value: longText } });

    // AC-3: Error indication when over limit
    await waitFor(() => {
      expect(screen.getByText(/2000文字以内/)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    expect(submitButton).toBeDisabled();
  });

  it("should show validation error from API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "投稿内容は必須です" }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[]}
      />
    );

    const textarea = screen.getByPlaceholderText(/エンジニアリングで共有/);
    fireEvent.change(textarea, { target: { value: "test" } });

    const submitButton = screen.getByRole("button", { name: "投稿する" });
    fireEvent.click(submitButton);

    // AC-3: Show API error message
    await waitFor(() => {
      expect(screen.getByText("投稿内容は必須です")).toBeInTheDocument();
    });
  });

  it("should prevent double submit when button is clicked rapidly", async () => {
    let callCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() => {
        callCount++;
        return new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  post: {
                    id: "p-new",
                    content: "test",
                    author: mockUser,
                    reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
                    commentCount: 0,
                  },
                }),
              }),
            100
          )
        );
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[]}
      />
    );

    const textarea = screen.getByPlaceholderText(/エンジニアリングで共有/);
    fireEvent.change(textarea, { target: { value: "test post" } });

    const submitButton = screen.getByRole("button", { name: "投稿する" });

    // Rapid clicks
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(callCount).toBe(1);
    });
  });
});

// Feature: Community Posting Home Aggregation (AC-4)
describe("CommunityPosting / HomeAggregation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display community label on posts in home feed", async () => {
    const mockApiPosts = [
      {
        id: "p1",
        content: "エンジニアリングの投稿です",
        createdAt: new Date().toISOString(),
        author: { id: "u1", name: "テストユーザー", role: "エンジニア", avatar: "/test.png" },
        reactions: { thumbsUp: 5, partyPopper: 2, lightbulb: 1, laugh: 0 },
        commentCount: 3,
        community: { name: "エンジニアリング", icon: "💻" },
      },
      {
        id: "p2",
        content: "デザインの投稿です",
        createdAt: new Date().toISOString(),
        author: { id: "u2", name: "デザイナー", role: "デザイナー", avatar: "/test2.png" },
        reactions: { thumbsUp: 3, partyPopper: 1, lightbulb: 2, laugh: 1 },
        commentCount: 1,
        community: { name: "デザイン", icon: "🎨" },
      },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: mockApiPosts }),
      })
    );

    const HomePage = (await import("@/app/page")).default;
    render(<HomePage />);

    // AC-4: Posts show community label with icon and name
    await waitFor(() => {
      expect(screen.getByText("💻 エンジニアリング")).toBeInTheDocument();
      expect(screen.getByText("🎨 デザイン")).toBeInTheDocument();
    });
  });

  it("should display newly created posts from API", async () => {
    const mockApiPosts = [
      {
        id: "p-new",
        content: "新しく作成された投稿です",
        createdAt: new Date().toISOString(),
        author: { id: "u1", name: "テストユーザー", role: "エンジニア", avatar: "/test.png" },
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentCount: 0,
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

    const HomePage = (await import("@/app/page")).default;
    render(<HomePage />);

    // AC-4: Newly created posts appear in home feed
    await waitFor(() => {
      expect(screen.getByText("新しく作成された投稿です")).toBeInTheDocument();
      expect(screen.getByText("💻 エンジニアリング")).toBeInTheDocument();
    });
  });

  it("should show empty state when no posts exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ posts: [] }),
      })
    );

    const HomePage = (await import("@/app/page")).default;
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/まだ投稿がありません/)).toBeInTheDocument();
    });
  });
});

// Feature: Edge Cases
describe("CommunityPosting / EdgeCases", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should not show post form when user is not a member (EC-1)", async () => {
    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={false}
        initialPosts={[]}
      />
    );

    // EC-1: No post form for non-members
    expect(
      screen.queryByPlaceholderText(/エンジニアリングで共有/)
    ).not.toBeInTheDocument();
  });
});
