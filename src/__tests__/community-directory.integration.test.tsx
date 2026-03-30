/**
 * Community Directory Integration Tests
 * Tests for community listing, navigation, and error/empty states.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0006: AC-1 to AC-3
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock AuthContext
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

const mockCommunities = [
  {
    id: "c1",
    name: "エンジニアリング",
    icon: "💻",
    description: "エンジニア向けのコミュニティです",
    memberCount: 89,
  },
  {
    id: "c2",
    name: "デザイン",
    icon: "🎨",
    description: "デザイナー向けのコミュニティです。UIやUXについて議論しましょう",
    memberCount: 42,
  },
  {
    id: "c3",
    name: "マーケティング",
    icon: "📊",
    description: "マーケティングチームのコミュニティ",
    memberCount: 0,
  },
];

// Feature: Community Directory Display (AC-1)
describe("CommunityDirectory / Display", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should display community name, icon, description, and member count", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ communities: mockCommunities }),
      })
    );

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("エンジニアリング")).toBeInTheDocument();
    });

    // AC-1: name, icon, description, memberCount visible
    expect(screen.getByText("💻")).toBeInTheDocument();
    expect(screen.getByText("エンジニア向けのコミュニティです")).toBeInTheDocument();
    expect(screen.getByText("89人のメンバー")).toBeInTheDocument();

    expect(screen.getByText("デザイン")).toBeInTheDocument();
    expect(screen.getByText("🎨")).toBeInTheDocument();
    expect(screen.getByText("42人のメンバー")).toBeInTheDocument();

    // EC-1: memberCount 0 is still displayed
    expect(screen.getByText("マーケティング")).toBeInTheDocument();
    expect(screen.getByText("0人のメンバー")).toBeInTheDocument();
  });

  it("should show skeleton loading state initially", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockReturnValue(new Promise(() => {})) // never resolves
    );

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    const { container } = render(<CommunitiesPage />);

    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBe(3);
  });
});

// Feature: Community Directory Navigation (AC-2)
describe("CommunityDirectory / Navigation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should have links to /community/{id} for each community", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ communities: mockCommunities }),
      })
    );

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("エンジニアリング")).toBeInTheDocument();
    });

    // AC-2: Each card links to /community/{id}
    const links = screen.getAllByRole("link");
    const hrefs = links.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/community/c1");
    expect(hrefs).toContain("/community/c2");
    expect(hrefs).toContain("/community/c3");
  });
});

// Feature: Community Directory Empty and Error States (AC-3)
describe("CommunityDirectory / EmptyAndError", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should display empty state when no communities exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ communities: [] }),
      })
    );

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(
        screen.getByText("コミュニティがまだありません")
      ).toBeInTheDocument();
    });
  });

  it("should display error message and retry button when fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })
    );

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(
        screen.getByText("コミュニティ一覧の取得に失敗しました")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("再試行")).toBeInTheDocument();
  });

  it("should retry fetch when retry button is clicked", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ communities: mockCommunities }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("再試行")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("再試行"));

    await waitFor(() => {
      expect(screen.getByText("エンジニアリング")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("should display error when network request throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    expect(screen.getByText("再試行")).toBeInTheDocument();
  });
});
