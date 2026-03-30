/**
 * Community Feed Integration Tests
 * Tests for community detail page functionality including display, reactions, comments, and architecture.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0003: AC-1 to AC-5
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { resetRepositories } from "@/lib/repositories";
import { getServices, resetServices } from "@/lib/services";

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
