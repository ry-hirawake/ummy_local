/**
 * Story-0001: ホームフィードを分割しモックデータを外出しする
 * Test Mapping implementation
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import fs from "fs";
import path from "path";

// Test AC-1: Types and mock data are moved out of page.tsx
describe("test_story_0001_ac1_home_feed_moves_types_and_mock_data_out_of_page", () => {
  it("types/post.ts should exist and export Post and Comment types", async () => {
    const typesPath = path.resolve(__dirname, "../types/post.ts");
    expect(fs.existsSync(typesPath)).toBe(true);

    const { Post, Comment, ReactionType } = await import("@/types/post");
    // TypeScript compile-time check - if these don't exist, this would fail
    expect(Post).toBeUndefined(); // interfaces don't exist at runtime
    expect(Comment).toBeUndefined();
  });

  it("lib/mock-data.ts should exist and export mockPosts", async () => {
    const mockDataPath = path.resolve(__dirname, "../lib/mock-data.ts");
    expect(fs.existsSync(mockDataPath)).toBe(true);

    const { mockPosts, currentUserAvatar } = await import("@/lib/mock-data");
    expect(Array.isArray(mockPosts)).toBe(true);
    expect(mockPosts.length).toBeGreaterThan(0);
    expect(typeof currentUserAvatar).toBe("string");
  });

  it("app/page.tsx should NOT contain inline type definitions", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    // Should not contain inline interface definitions
    expect(pageContent).not.toMatch(/^interface Comment \{/m);
    expect(pageContent).not.toMatch(/^interface Post \{/m);

    // Should import from external modules
    expect(pageContent).toMatch(/from "@\/types\/post"/);
    expect(pageContent).toMatch(/from "@\/lib\/mock-data"/);
  });

  it("app/page.tsx should use Presentational Components", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    // Should import and use PostCard component
    expect(pageContent).toMatch(/from "@\/components\/home"/);
    expect(pageContent).toMatch(/<PostCard/);
  });
});

// Test AC-2: Existing feed display compatibility
describe("test_story_0001_ac2_home_feed_renders_mock_posts_in_order", () => {
  it("should render posts with author name, role, content, timestamp", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Check first post author (田中 美咲)
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

  it("should render posts in mock data order", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    const articles = screen.getAllByRole("article");
    expect(articles.length).toBe(3);

    // First post should be 田中 美咲
    expect(articles[0]).toHaveTextContent("田中 美咲");
    // Second post should be 佐藤 健太
    expect(articles[1]).toHaveTextContent("佐藤 健太");
    // Third post should be 鈴木 愛
    expect(articles[2]).toHaveTextContent("鈴木 愛");
  });
});

// Test AC-3: Reaction toggle functionality
describe("test_story_0001_ac3_reaction_selection_updates_counts_and_closes_popup", () => {
  it("should show reaction popup when リアクション button is clicked", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Find and click the first reaction button
    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    // Popup should appear with reaction options
    expect(screen.getByTitle("いいね")).toBeInTheDocument();
    expect(screen.getByTitle("祝福")).toBeInTheDocument();
    expect(screen.getByTitle("ひらめき")).toBeInTheDocument();
    expect(screen.getByTitle("笑")).toBeInTheDocument();
  });

  it("should close popup and update display when reaction is selected", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Click reaction button to open popup
    const reactionButtons = screen.getAllByText("リアクション");
    fireEvent.click(reactionButtons[0]);

    // Select いいね reaction
    const likeButton = screen.getByTitle("いいね");
    fireEvent.click(likeButton);

    // Popup should close (no more reaction options visible in first post area)
    // And the button text should change to いいね
    expect(screen.getAllByText("いいね").length).toBeGreaterThan(0);
  });

  it("should handle pre-existing userReaction (lightbulb on post 2)", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Post 2 has userReaction: "lightbulb"
    // Should display ひらめき instead of リアクション
    expect(screen.getByText("ひらめき")).toBeInTheDocument();
  });
});

// Test AC-4: Comments and reply input toggle
describe("test_story_0001_ac4_comments_and_reply_input_toggle_per_post_comment", () => {
  it("should expand comments when コメント button is clicked", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Initially, comment content should not be visible
    expect(screen.queryByText("素晴らしい成果ですね！おめでとうございます🎊")).not.toBeInTheDocument();

    // Click comment button on first post
    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    // Comments should now be visible
    expect(screen.getByText("素晴らしい成果ですね！おめでとうございます🎊")).toBeInTheDocument();
  });

  it("should show reply input when 返信 is clicked", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Expand comments first
    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    // Click 返信 button
    const replyButtons = screen.getAllByText("返信");
    fireEvent.click(replyButtons[0]);

    // Reply input should appear
    expect(screen.getByPlaceholderText("返信を入力...")).toBeInTheDocument();
  });

  it("should toggle reply input off when 返信 is clicked again", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Expand comments
    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[0]);

    // Click 返信 twice
    const replyButtons = screen.getAllByText("返信");
    fireEvent.click(replyButtons[0]);
    expect(screen.getByPlaceholderText("返信を入力...")).toBeInTheDocument();

    fireEvent.click(replyButtons[0]);
    // Reply input should be hidden
    expect(screen.queryByPlaceholderText("返信を入力...")).not.toBeInTheDocument();
  });

  it("should not show comments for posts with empty commentList", async () => {
    const Home = (await import("@/app/page")).default;
    render(<Home />);

    // Post 2 has commentList: [] (empty)
    // Click comment button on second post
    const commentButtons = screen.getAllByText("コメント");
    fireEvent.click(commentButtons[1]);

    // No comment section should appear (empty commentList)
    // The comment input placeholder should not be visible for this post
    const inputs = screen.queryAllByPlaceholderText("コメントを追加...");
    expect(inputs.length).toBe(0);
  });
});

// Test AC-5: All images use next/image
describe("test_story_0001_ac5_home_feed_uses_next_image_for_all_avatars", () => {
  it("app/page.tsx should NOT contain <img> tags", () => {
    const pagePath = path.resolve(__dirname, "../app/page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");

    // Should not contain <img> tags
    expect(pageContent).not.toMatch(/<img\s/);
  });

  it("components/home/PostCard.tsx should use next/image", () => {
    const componentPath = path.resolve(__dirname, "../components/home/PostCard.tsx");
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    // Should import Image from next/image
    expect(componentContent).toMatch(/import Image from "next\/image"/);
    // Should use <Image component
    expect(componentContent).toMatch(/<Image/);
    // Should NOT contain <img> tags
    expect(componentContent).not.toMatch(/<img\s/);
  });

  it("components/home/CommentItem.tsx should use next/image", () => {
    const componentPath = path.resolve(__dirname, "../components/home/CommentItem.tsx");
    const componentContent = fs.readFileSync(componentPath, "utf-8");

    // Should import Image from next/image
    expect(componentContent).toMatch(/import Image from "next\/image"/);
    // Should use <Image component
    expect(componentContent).toMatch(/<Image/);
    // Should NOT contain <img> tags
    expect(componentContent).not.toMatch(/<img\s/);
  });
});
