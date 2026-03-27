/**
 * Home Feed Integration Tests
 * Tests for home feed functionality including post display, reactions, and comments.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0001: AC-1 to AC-5
 */

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import fs from "fs";
import path from "path";

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
  it("should render posts with author info and timestamp", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    expect(screen.getByText("田中 美咲")).toBeInTheDocument();
    expect(screen.getByText("マーケティングマネージャー")).toBeInTheDocument();
    expect(screen.getByText("2時間前")).toBeInTheDocument();
  });

  it("should render community name for posts", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    expect(screen.getByText("📊 マーケティング")).toBeInTheDocument();
    expect(screen.getByText("💻 エンジニアリング")).toBeInTheDocument();
  });

  it("should render posts in correct order", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(3);
    expect(articles[0]).toHaveTextContent("田中 美咲");
    expect(articles[1]).toHaveTextContent("佐藤 健太");
    expect(articles[2]).toHaveTextContent("鈴木 愛");
  });
});

// Feature: Reactions
describe("HomeFeed / Reactions", () => {
  it("should show reaction popup when button is clicked", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    expect(screen.getByTitle("いいね")).toBeInTheDocument();
    expect(screen.getByTitle("祝福")).toBeInTheDocument();
    expect(screen.getByTitle("ひらめき")).toBeInTheDocument();
    expect(screen.getByTitle("笑")).toBeInTheDocument();
  });

  it("should update display when reaction is selected", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    const likeButton = screen.getByTitle("いいね");
    fireEvent.click(likeButton);

    expect(screen.getAllByText("いいね").length).toBeGreaterThan(0);
  });

  it("should display pre-existing user reaction", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Post 2 has userReaction: "lightbulb"
    expect(screen.getByText("ひらめき")).toBeInTheDocument();
  });
});

// Feature: Comments
describe("HomeFeed / Comments", () => {
  it("should expand comments when button is clicked", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    expect(screen.queryByText("素晴らしい成果ですね！おめでとうございます🎊")).not.toBeInTheDocument();

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    expect(screen.getByText("素晴らしい成果ですね！おめでとうございます🎊")).toBeInTheDocument();
  });

  it("should show reply input when reply button is clicked", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    const replyButtons = screen.getAllByText("返信");
    fireEvent.click(replyButtons[0]);

    expect(screen.getByPlaceholderText("返信を入力...")).toBeInTheDocument();
  });

  it("should toggle reply input off when clicked again", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    const replyButtons = screen.getAllByText("返信");
    fireEvent.click(replyButtons[0]);
    expect(screen.getByPlaceholderText("返信を入力...")).toBeInTheDocument();

    fireEvent.click(replyButtons[0]);
    expect(screen.queryByPlaceholderText("返信を入力...")).not.toBeInTheDocument();
  });

  it("should not show comments section for posts with empty comment list", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[1]); // Post 2 has empty commentList

    const inputs = screen.queryAllByPlaceholderText("コメントを追加...");
    expect(inputs.length).toBe(0);
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
    const componentPath = path.resolve(__dirname, "../components/home/PostCard.tsx");
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).toMatch(/<Image/);
    expect(componentContent).not.toMatch(/<img\s/);
  });

  it("should use next/image in CommentItem component", () => {
    const componentPath = path.resolve(__dirname, "../components/home/CommentItem.tsx");
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    expect(componentContent).toMatch(/import Image from "next\/image"/);
    expect(componentContent).toMatch(/<Image/);
    expect(componentContent).not.toMatch(/<img\s/);
  });
});
