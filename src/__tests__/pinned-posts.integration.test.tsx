/**
 * Pinned Posts Integration Tests (Story-0017)
 *
 * Story Mapping (tracked in SSOT):
 * - AC-1: PinnedPosts / Pin — owner pins a post, replaces existing pin
 * - AC-2: PinnedPosts / Unpin — owner unpins a post, chronological order restored
 * - AC-3: PinnedPosts / Permissions — only owner can pin; member/admin cannot
 * - UI: CommunityPostCard pin menu visibility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createInMemoryRepositories } from "@/lib/repositories/in-memory";
import { PostService } from "@/lib/services/post-service";
import type { Repositories } from "@/lib/repositories/types";

// Mock AuthContext
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

// ============================================================
// Service Layer Tests
// ============================================================

describe("PinnedPosts / Pin (AC-1)", () => {
  let repos: Repositories;

  beforeEach(() => {
    repos = createInMemoryRepositories();
  });

  it("owner pins a post — isPinned becomes true", async () => {
    const service = new PostService(repos);
    // user-1 is owner of community-1, post-5 is unpinned in community-1
    const result = await service.updatePin("post-5", "user-1", true);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPinned).toBe(true);
    }
  });

  it("pinning replaces existing pinned post (1-pin constraint)", async () => {
    const service = new PostService(repos);
    // post-4 is already pinned in community-1
    const before = await repos.posts.findById("post-4");
    expect(before?.isPinned).toBe(true);

    // Pin post-5 in the same community
    const result = await service.updatePin("post-5", "user-1", true);
    expect(result.success).toBe(true);

    // post-4 should now be unpinned
    const after = await repos.posts.findById("post-4");
    expect(after?.isPinned).toBe(false);

    // post-5 should be pinned
    if (result.success) {
      expect(result.data.isPinned).toBe(true);
    }
  });
});

describe("PinnedPosts / Unpin (AC-2)", () => {
  let repos: Repositories;

  beforeEach(() => {
    repos = createInMemoryRepositories();
  });

  it("owner unpins a pinned post — isPinned becomes false", async () => {
    const service = new PostService(repos);
    // post-4 is pinned in community-1
    const result = await service.updatePin("post-4", "user-1", false);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isPinned).toBe(false);
    }
  });

  it("after unpin, community feed returns posts in chronological order", async () => {
    const service = new PostService(repos);
    // post-4 is pinned in community-1 (created 1h ago)
    // post-5 is unpinned in community-1 (created 3h ago)
    // post-6 is unpinned in community-1 (created 5h ago)

    // Verify pinned post is first before unpin
    const before = await service.getByCommunityId("community-1", "user-1");
    expect(before.success).toBe(true);
    if (before.success) {
      expect(before.data[0].id).toBe("post-4");
      expect(before.data[0].isPinned).toBe(true);
    }

    // Unpin post-4
    await service.updatePin("post-4", "user-1", false);

    // After unpin, all posts should be in pure createdAt descending order
    const after = await service.getByCommunityId("community-1", "user-1");
    expect(after.success).toBe(true);
    if (after.success) {
      // post-4 (1h ago) > post-5 (3h ago) > post-6 (5h ago)
      expect(after.data[0].id).toBe("post-4");
      expect(after.data[0].isPinned).toBe(false);
      expect(after.data[1].id).toBe("post-5");
      expect(after.data[2].id).toBe("post-6");
      // Verify chronological ordering (newest first)
      for (let i = 0; i < after.data.length - 1; i++) {
        expect(after.data[i].createdAt.getTime()).toBeGreaterThanOrEqual(
          after.data[i + 1].createdAt.getTime()
        );
      }
    }
  });
});

describe("PinnedPosts / Permissions (AC-3)", () => {
  let repos: Repositories;

  beforeEach(() => {
    repos = createInMemoryRepositories();
  });

  it("member cannot pin a post — returns FORBIDDEN", async () => {
    const service = new PostService(repos);
    // user-2 is member (not admin/owner) of community-1
    const result = await service.updatePin("post-5", "user-2", true);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("FORBIDDEN");
    }
  });

  it("owner can pin a post — returns success", async () => {
    const service = new PostService(repos);
    // user-1 is owner of community-1
    const result = await service.updatePin("post-5", "user-1", true);
    expect(result.success).toBe(true);
  });

  it("admin cannot pin a post — returns FORBIDDEN (owner-only rule)", async () => {
    const service = new PostService(repos);
    // Create an admin membership for user-2 in community-1
    // First remove existing member membership, then re-create as admin
    await repos.memberships.delete("user-2", "community-1");
    await repos.memberships.create("user-2", "community-1", "admin");

    const result = await service.updatePin("post-5", "user-2", true);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("FORBIDDEN");
    }
  });

  it("non-member cannot pin a post — returns FORBIDDEN", async () => {
    const service = new PostService(repos);
    // Create a post in a community where a hypothetical user has no membership
    const result = await service.updatePin("post-5", "non-existent-user", true);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("FORBIDDEN");
    }
  });

  it("returns NOT_FOUND for non-existent post", async () => {
    const service = new PostService(repos);
    const result = await service.updatePin("post-999", "user-1", true);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });
});

// ============================================================
// UI Tests
// ============================================================

const mockCommunity = {
  name: "エンジニアリング",
  icon: "💻",
  description: "エンジニアコミュニティ",
  members: 50,
};

const mockPost = {
  id: "post-1",
  author: { name: "テストユーザー", role: "エンジニア", avatar: "/test.png" },
  content: "テスト投稿",
  timestamp: "1時間前",
  likes: 0,
  comments: 0,
  shares: 0,
  reactions: { thumbsUp: 0, partyPopper: 0, lightbulb: 0, laugh: 0 },
  isPinned: false,
};

describe("PinnedPosts / UI", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows pin button in menu when canPin is true", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[mockPost]}
        userRole="owner"
      />
    );

    // Click the more menu button
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons.find((btn) =>
      btn.querySelector("svg.lucide-more-horizontal, svg.lucide-ellipsis")
    );
    expect(moreButton).toBeDefined();
    fireEvent.click(moreButton!);

    await waitFor(() => {
      expect(screen.getByText("ピン留め")).toBeInTheDocument();
    });
  });

  it("does not show pin button for admin role (owner-only)", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[mockPost]}
        userRole="admin"
      />
    );

    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons.find((btn) =>
      btn.querySelector("svg.lucide-more-horizontal, svg.lucide-ellipsis")
    );
    expect(moreButton).toBeDefined();
    fireEvent.click(moreButton!);

    expect(screen.queryByText("ピン留め")).not.toBeInTheDocument();
  });

  it("does not show pin button when canPin is false (member role)", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[mockPost]}
        userRole="member"
      />
    );

    // Click the more menu button
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons.find((btn) =>
      btn.querySelector("svg.lucide-more-horizontal, svg.lucide-ellipsis")
    );
    expect(moreButton).toBeDefined();
    fireEvent.click(moreButton!);

    // Pin button should not appear
    expect(screen.queryByText("ピン留め")).not.toBeInTheDocument();
  });

  it("shows unpin label for already-pinned post", async () => {
    vi.stubGlobal("fetch", vi.fn());

    const pinnedPost = { ...mockPost, isPinned: true };

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[pinnedPost]}
        userRole="owner"
      />
    );

    // Click the more menu button
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons.find((btn) =>
      btn.querySelector("svg.lucide-more-horizontal, svg.lucide-ellipsis")
    );
    fireEvent.click(moreButton!);

    await waitFor(() => {
      expect(screen.getByText("ピン留め解除")).toBeInTheDocument();
    });
  });

  it("calls PATCH API when pin button is clicked", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ post: { ...mockPost, isPinned: true } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={true}
        initialPosts={[mockPost]}
        userRole="owner"
      />
    );

    // Open menu and click pin
    const moreButtons = screen.getAllByRole("button");
    const moreButton = moreButtons.find((btn) =>
      btn.querySelector("svg.lucide-more-horizontal, svg.lucide-ellipsis")
    );
    fireEvent.click(moreButton!);

    await waitFor(() => {
      expect(screen.getByText("ピン留め")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("ピン留め"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/posts/post-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: true }),
      });
    });
  });
});
