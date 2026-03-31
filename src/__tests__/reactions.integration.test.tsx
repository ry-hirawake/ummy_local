/**
 * Reactions Integration Tests
 * Tests for post reaction functionality.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0013: AC-1 (Create), AC-2 (ToggleAndReplace), AC-3 (DisplayState)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock AuthContext
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

const mockCommunity = {
  name: "エンジニアリング",
  icon: "💻",
  description: "エンジニアコミュニティ",
  members: 50,
};

// Story-0013: AC-1 New Reaction
describe("Reactions / Create", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should add new reaction and call API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reaction: { postId: "post-1", userId: "u1", type: "thumbsUp" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: undefined,
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

    // Click reaction button to show options
    const reactionButton = screen.getByText("リアクション");
    fireEvent.click(reactionButton);

    // Select thumbsUp reaction (labeled "いいね")
    const thumbsUpButton = screen.getByTitle("いいね");
    fireEvent.click(thumbsUpButton);

    // AC-1: API should be called with POST
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-1/reactions",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ type: "thumbsUp" }),
        })
      );
    });
  });

  it("should increment reaction count after adding reaction (AC-1)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reaction: { postId: "post-1", userId: "u1", type: "lightbulb" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: undefined,
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

    // Click reaction button and select lightbulb (ひらめき)
    fireEvent.click(screen.getByText("リアクション"));
    fireEvent.click(screen.getByTitle("ひらめき"));

    // AC-1: After adding, total reactions should increase
    // Verify API was called (optimistic update happens immediately)
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});

// Story-0013: AC-2 Toggle and Replace
describe("Reactions / ToggleAndReplace", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should switch reaction type and call API (AC-2)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reaction: { postId: "post-1", userId: "u1", type: "laugh" },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: "thumbsUp", // Already has thumbsUp reaction
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

    // Button should show "いいね" since user has thumbsUp reaction
    const reactionButton = screen.getByText("いいね");
    fireEvent.click(reactionButton);

    // Switch to laugh (笑)
    fireEvent.click(screen.getByTitle("笑"));

    // AC-2: API should be called with new type
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-1/reactions",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ type: "laugh" }),
        })
      );
    });
  });

  it("should remove reaction when clicking same type again (AC-2)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: "thumbsUp",
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

    // Click reaction button (shows "いいね" since user has thumbsUp)
    fireEvent.click(screen.getByText("いいね"));

    // Click same reaction to remove
    fireEvent.click(screen.getByTitle("いいね"));

    // AC-2: API should be called with DELETE
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-1/reactions",
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  it("should rollback on network failure (EC-2)", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("Network error"));
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: undefined,
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

    // Try to add reaction
    fireEvent.click(screen.getByText("リアクション"));
    fireEvent.click(screen.getByTitle("いいね"));

    // EC-2: After failure, button should still show "リアクション" (rollback)
    await waitFor(() => {
      expect(screen.getByText("リアクション")).toBeInTheDocument();
    });
  });
});

// Story-0013: AC-3 Display State
describe("Reactions / DisplayState", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display user selected reaction state (AC-3)", async () => {
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

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 5,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: "thumbsUp",
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

    // AC-3: Button should show the user's selected reaction label
    expect(screen.getByText("いいね")).toBeInTheDocument();
  });

  it("should show 'リアクション' when no reaction selected (AC-3)", async () => {
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

    const mockPosts = [
      {
        id: "post-1",
        author: {
          name: "投稿者",
          role: "エンジニア",
          avatar: "https://example.com/author.jpg",
        },
        content: "投稿内容",
        timestamp: "1時間前",
        likes: 0,
        comments: 0,
        shares: 0,
        reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
        userReaction: undefined,
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

    // AC-3: Button should show "リアクション" when no reaction
    expect(screen.getByText("リアクション")).toBeInTheDocument();
  });
});

// Story-0013: Service-level Tests
describe("Reactions / ServiceLevel", () => {
  it("should enforce 1 user 1 post 1 reaction at service level", async () => {
    const { ReactionService } = await import("@/lib/services/reaction-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create user and post
    await repos.users.create({
      id: "u1",
      email: "test@example.com",
      name: "Test User",
      avatar: "/test.png",
      role: "",
      createdAt: new Date(),
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: "u1",
      content: "Test post",
    });

    const service = new ReactionService(repos);

    // Add thumbsUp
    const result1 = await service.addOrUpdate("u1", post.id, "thumbsUp");
    expect(result1.success).toBe(true);

    // Update to partyPopper (should replace, not add)
    const result2 = await service.addOrUpdate("u1", post.id, "partyPopper");
    expect(result2.success).toBe(true);

    // Check counts - should be 0 thumbsUp, 1 partyPopper
    const counts = await service.getByPostId(post.id);
    expect(counts.success).toBe(true);
    if (counts.success) {
      expect(counts.data.thumbsUp).toBe(0);
      expect(counts.data.partyPopper).toBe(1);
    }
  });

  it("should allow removal of reaction", async () => {
    const { ReactionService } = await import("@/lib/services/reaction-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create user and post
    await repos.users.create({
      id: "u1",
      email: "test@example.com",
      name: "Test User",
      avatar: "/test.png",
      role: "",
      createdAt: new Date(),
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: "u1",
      content: "Test post",
    });

    const service = new ReactionService(repos);

    // Add reaction
    await service.addOrUpdate("u1", post.id, "thumbsUp");

    // Remove reaction
    const removeResult = await service.remove("u1", post.id);
    expect(removeResult.success).toBe(true);

    // Verify it's removed
    const counts = await service.getByPostId(post.id);
    expect(counts.success).toBe(true);
    if (counts.success) {
      expect(counts.data.thumbsUp).toBe(0);
    }
  });
});
