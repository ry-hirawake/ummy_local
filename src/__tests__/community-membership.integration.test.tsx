/**
 * Community Membership Integration Tests
 * Tests for join/leave functionality and idempotency.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0008: AC-1 to AC-3
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock AuthContext
const mockUser = { id: "u1", name: "テストユーザー", avatar: "/test.png" };
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}));

const mockCommunity = {
  name: "エンジニアリング",
  icon: "💻",
  description: "エンジニア向けコミュニティ",
  members: 89,
};

// Feature: Community Membership Join (AC-1)
describe("CommunityMembership / Join", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should change button to '参加中' after successful join", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ membership: { id: "m1", userId: "u1", communityId: "c1" } }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={false}
      />
    );

    // Initially shows "参加する"
    const joinButton = screen.getByRole("button", { name: "参加する" });
    expect(joinButton).toBeInTheDocument();

    fireEvent.click(joinButton);

    // AC-1: Button changes to "参加中"
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加中" })).toBeInTheDocument();
    });
  });

  it("should call POST /api/communities/{id}/members when join button is clicked", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ membership: { id: "m1" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={false}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "参加する" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/communities/c1/members", {
        method: "POST",
      });
    });
  });

  it("should increment member count after successful join", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ membership: { id: "m1" } }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={false}
      />
    );

    // Initially shows 89 members
    expect(screen.getByText("89人のメンバー")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "参加する" }));

    // AC-1: Member count increases by 1
    await waitFor(() => {
      expect(screen.getByText("90人のメンバー")).toBeInTheDocument();
    });
  });
});

// Feature: Community Membership Leave (AC-2)
describe("CommunityMembership / Leave", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should change button to '参加する' after successful leave", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
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

    // Initially shows "参加中"
    const leaveButton = screen.getByRole("button", { name: "参加中" });
    expect(leaveButton).toBeInTheDocument();

    fireEvent.click(leaveButton);

    // AC-2: Button changes to "参加する"
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加する" })).toBeInTheDocument();
    });
  });

  it("should call DELETE /api/communities/{id}/members when leave button is clicked", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
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
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "参加中" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/communities/c1/members", {
        method: "DELETE",
      });
    });
  });

  it("should decrement member count after successful leave", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
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

    // Initially shows 89 members
    expect(screen.getByText("89人のメンバー")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "参加中" }));

    // AC-2: Member count decreases by 1
    await waitFor(() => {
      expect(screen.getByText("88人のメンバー")).toBeInTheDocument();
    });
  });
});

// Feature: Community Membership Idempotency (AC-3)
describe("CommunityMembership / Idempotency", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should handle 409 conflict gracefully when already joined", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: "既にメンバーです" }),
      })
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={false}
      />
    );

    // Initially: 89 members (user already counted on server but client thinks not joined)
    expect(screen.getByText("89人のメンバー")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "参加する" }));

    // AC-3: UI reflects actual state (joined) even when 409 received
    // memberCount should stay at 89 (user was already counted)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加中" })).toBeInTheDocument();
      expect(screen.getByText("89人のメンバー")).toBeInTheDocument();
    });
  });

  it("should handle 404 gracefully when already left", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "メンバーシップが見つかりません" }),
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

    // Initially: 89 members (but user is not actually a member on server)
    expect(screen.getByText("89人のメンバー")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "参加中" }));

    // AC-3: UI reflects actual state (not joined) even when 404 received
    // memberCount should be 88 (user was already not counted on server)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加する" })).toBeInTheDocument();
      expect(screen.getByText("88人のメンバー")).toBeInTheDocument();
    });
  });

  it("should rollback optimistic update on network failure during join", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const { CommunityPageClient } = await import(
      "@/app/community/[id]/CommunityPageClient"
    );
    render(
      <CommunityPageClient
        community={mockCommunity}
        communityId="c1"
        initialMembership={false}
      />
    );

    const joinButton = screen.getByRole("button", { name: "参加する" });
    fireEvent.click(joinButton);

    // EC-2: Optimistic update is rolled back
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加する" })).toBeInTheDocument();
      expect(screen.getByText("89人のメンバー")).toBeInTheDocument();
    });
  });

  it("should rollback optimistic update on network failure during leave", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
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

    const leaveButton = screen.getByRole("button", { name: "参加中" });
    fireEvent.click(leaveButton);

    // EC-2: Optimistic update is rolled back
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加中" })).toBeInTheDocument();
      expect(screen.getByText("89人のメンバー")).toBeInTheDocument();
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
                json: async () => ({ membership: { id: "m1" } }),
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
        initialMembership={false}
      />
    );

    const joinButton = screen.getByRole("button", { name: "参加する" });

    // Rapid clicks
    fireEvent.click(joinButton);
    fireEvent.click(joinButton);
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "参加中" })).toBeInTheDocument();
    });

    // AC-3: Only one API call is made
    expect(callCount).toBe(1);
  });
});
