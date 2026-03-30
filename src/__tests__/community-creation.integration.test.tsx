/**
 * Community Creation Integration Tests
 * Tests for community creation form, submission, and validation.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0007: AC-1 to AC-3
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { resetRepositories } from "@/lib/repositories";
import { getServices, resetServices } from "@/lib/services";

// Mock AuthContext
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: vi.fn(() => ({
    user: { id: "u1", name: "テストユーザー", avatar: "/test.png" },
  })),
}));

// Feature: Community Creation Form (AC-1)
describe("CommunityCreation / Form", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // stub fetch so the page renders communities list
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ communities: [] }),
      })
    );
  });

  it("should display name, icon, and description fields when dialog is opened", async () => {
    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText("コミュニティを作成")).toBeInTheDocument();
    });

    // Open dialog
    fireEvent.click(screen.getByText("コミュニティを作成"));

    // AC-1: form displays name, icon, description fields
    expect(screen.getByLabelText(/コミュニティ名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/アイコン/)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/)).toBeInTheDocument();
  });

  it("should disable submit button when name is empty", async () => {
    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("コミュニティを作成")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("コミュニティを作成"));

    // AC-1: submit blocked when required fields are missing
    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when name is provided", async () => {
    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("コミュニティを作成")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("コミュニティを作成"));

    const nameInput = screen.getByLabelText(/コミュニティ名/);
    fireEvent.change(nameInput, { target: { value: "テストコミュニティ" } });

    const submitButton = screen.getByRole("button", { name: "作成" });
    expect(submitButton).not.toBeDisabled();
  });
});

// Feature: Community Creation Submit Success (AC-2)
describe("CommunityCreation / SubmitSuccess", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetServices();
    resetRepositories();
  });

  it("should redirect to community detail page on successful creation", async () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    });

    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ communities: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ community: { id: "community-99" } }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("コミュニティを作成")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("コミュニティを作成"));

    const nameInput = screen.getByLabelText(/コミュニティ名/);
    fireEvent.change(nameInput, { target: { value: "新しいコミュニティ" } });

    const submitButton = screen.getByRole("button", { name: "作成" });
    fireEvent.click(submitButton);

    // AC-2: redirect to community detail page
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/community/community-99");
    });

    // AC-2: POST was called with correct data
    expect(fetchMock).toHaveBeenCalledWith("/api/communities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "新しいコミュニティ",
        icon: "",
        description: "",
      }),
    });
  });

  it("should render the generated community detail page for a newly created community id", async () => {
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

    const CommunityPage = (await import("@/app/community/[id]/page")).default;
    const element = await CommunityPage({
      params: Promise.resolve({ id: result.data.id }),
    });

    render(element);

    expect(screen.getByText("SRE")).toBeInTheDocument();
    expect(screen.getByText("1人のメンバー")).toBeInTheDocument();
    expect(screen.getByText("運用と信頼性を扱うコミュニティ")).toBeInTheDocument();
  });
});

// Feature: Community Creation Validation (AC-3)
describe("CommunityCreation / Validation", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should display error message when server returns validation error", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ communities: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "コミュニティ名は必須です" }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("コミュニティを作成")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("コミュニティを作成"));

    const nameInput = screen.getByLabelText(/コミュニティ名/);
    fireEvent.change(nameInput, { target: { value: "a" } });

    const submitButton = screen.getByRole("button", { name: "作成" });
    fireEvent.click(submitButton);

    // AC-3: validation error displayed
    await waitFor(() => {
      expect(screen.getByText("コミュニティ名は必須です")).toBeInTheDocument();
    });
  });

  it("should display error message when server returns conflict error", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ communities: [] }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "同じ名前のコミュニティが既に存在します" }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const CommunitiesPage = (await import("@/app/communities/page")).default;
    render(<CommunitiesPage />);

    await waitFor(() => {
      expect(screen.getByText("コミュニティを作成")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("コミュニティを作成"));

    const nameInput = screen.getByLabelText(/コミュニティ名/);
    fireEvent.change(nameInput, { target: { value: "エンジニアリング" } });

    const submitButton = screen.getByRole("button", { name: "作成" });
    fireEvent.click(submitButton);

    // AC-3: conflict error displayed
    await waitFor(() => {
      expect(
        screen.getByText("同じ名前のコミュニティが既に存在します")
      ).toBeInTheDocument();
    });
  });
});
