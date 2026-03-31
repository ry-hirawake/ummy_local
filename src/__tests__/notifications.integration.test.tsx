/**
 * Notifications Integration Tests
 * Tests for notification generation, badge display, and read flow.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0016: AC-1 (Generation), AC-2 (Badge), AC-3 (ListAndRead)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// --- AC-1: Notification Generation (Service-level) ---

describe("Notifications / Generation", () => {
  it("should generate notification for post author on comment", async () => {
    const { CommentService } = await import("@/lib/services/comment-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create post author and commenter
    const postAuthor = await repos.users.create({
      email: "author@example.com",
      name: "投稿者",
      avatar: "/author.png",
      role: "エンジニア",
    });
    const commenter = await repos.users.create({
      email: "commenter@example.com",
      name: "コメンター",
      avatar: "/commenter.png",
      role: "デザイナー",
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: postAuthor.id,
      content: "テスト投稿",
    });

    const service = new CommentService(repos);
    await service.create({
      postId: post.id,
      authorId: commenter.id,
      content: "コメントです",
    });

    // Notification should be created for post author
    const notifications = await repos.notifications.findByUserId(postAuthor.id);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe("comment");
    expect(notifications[0].message).toContain("コメンター");
    // AC-1 Example: notification identifies which post
    expect(notifications[0].message).toContain("テスト投稿");
    expect(notifications[0].referenceId).toBe(post.id);
  });

  it("should generate notification for post author on reaction", async () => {
    const { ReactionService } = await import("@/lib/services/reaction-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    const postAuthor = await repos.users.create({
      email: "author@example.com",
      name: "投稿者",
      avatar: "/author.png",
      role: "エンジニア",
    });
    const reactor = await repos.users.create({
      email: "reactor@example.com",
      name: "リアクター",
      avatar: "/reactor.png",
      role: "デザイナー",
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: postAuthor.id,
      content: "テスト投稿",
    });

    const service = new ReactionService(repos);
    await service.addOrUpdate(reactor.id, post.id, "thumbsUp");

    const notifications = await repos.notifications.findByUserId(postAuthor.id);
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe("reaction");
    expect(notifications[0].message).toContain("リアクター");
    // AC-1 Example: notification identifies which post
    expect(notifications[0].message).toContain("テスト投稿");
    expect(notifications[0].referenceId).toBe(post.id);
  });

  it("should truncate long post content in notification message", async () => {
    const { CommentService } = await import("@/lib/services/comment-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    const postAuthor = await repos.users.create({
      email: "author@example.com",
      name: "投稿者",
      avatar: "/author.png",
      role: "エンジニア",
    });
    const commenter = await repos.users.create({
      email: "commenter@example.com",
      name: "コメンター",
      avatar: "/commenter.png",
      role: "デザイナー",
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: postAuthor.id,
      content: "これはとても長い投稿内容で二十文字を超えています。省略されるべきです。",
    });

    const service = new CommentService(repos);
    await service.create({
      postId: post.id,
      authorId: commenter.id,
      content: "コメント",
    });

    const notifications = await repos.notifications.findByUserId(postAuthor.id);
    expect(notifications).toHaveLength(1);
    // Should be truncated with ellipsis
    expect(notifications[0].message).toContain("…");
    expect(notifications[0].message).toContain("「");
  });

  it("EC-1: should NOT generate notification for self-comment", async () => {
    const { CommentService } = await import("@/lib/services/comment-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    const user = await repos.users.create({
      email: "user@example.com",
      name: "ユーザー",
      avatar: "/user.png",
      role: "エンジニア",
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: user.id,
      content: "自分の投稿",
    });

    const service = new CommentService(repos);
    await service.create({
      postId: post.id,
      authorId: user.id, // Same user as post author
      content: "自分でコメント",
    });

    const notifications = await repos.notifications.findByUserId(user.id);
    expect(notifications).toHaveLength(0);
  });

  it("EC-1: should NOT generate notification for self-reaction", async () => {
    const { ReactionService } = await import("@/lib/services/reaction-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    const user = await repos.users.create({
      email: "user@example.com",
      name: "ユーザー",
      avatar: "/user.png",
      role: "エンジニア",
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: user.id,
      content: "自分の投稿",
    });

    const service = new ReactionService(repos);
    await service.addOrUpdate(user.id, post.id, "thumbsUp");

    const notifications = await repos.notifications.findByUserId(user.id);
    expect(notifications).toHaveLength(0);
  });

  it("should NOT generate notification on reaction update (only on new create)", async () => {
    const { ReactionService } = await import("@/lib/services/reaction-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    const postAuthor = await repos.users.create({
      email: "author@example.com",
      name: "投稿者",
      avatar: "/author.png",
      role: "エンジニア",
    });
    const reactor = await repos.users.create({
      email: "reactor@example.com",
      name: "リアクター",
      avatar: "/reactor.png",
      role: "デザイナー",
    });
    const post = await repos.posts.create({
      communityId: "c1",
      authorId: postAuthor.id,
      content: "テスト投稿",
    });

    const service = new ReactionService(repos);

    // First reaction → notification generated
    await service.addOrUpdate(reactor.id, post.id, "thumbsUp");
    // Change reaction type → should NOT generate another notification
    await service.addOrUpdate(reactor.id, post.id, "laugh");

    const notifications = await repos.notifications.findByUserId(postAuthor.id);
    expect(notifications).toHaveLength(1); // Only 1, not 2
  });
});

// --- AC-2: Badge Display (UI) ---

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
}));

// Mock motion/react to render plain elements
vi.mock("motion/react", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop) => {
        return ({
          children,
          ...rest
        }: React.PropsWithChildren<Record<string, unknown>>) => {
          const domProps: Record<string, unknown> = {};
          const skipKeys = new Set([
            "whileHover",
            "whileTap",
            "initial",
            "animate",
            "transition",
            "layoutId",
          ]);
          for (const [k, v] of Object.entries(rest)) {
            if (!skipKeys.has(k)) domProps[k] = v;
          }
          const Tag = prop as keyof JSX.IntrinsicElements;
          return <Tag {...domProps}>{children}</Tag>;
        };
      },
    }
  ),
}));

describe("Notifications / Badge", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("AC-2: should show badge with unread count when > 0", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ unreadCount: 3 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    await waitFor(() => {
      const badge = screen.getByTestId("notification-badge");
      expect(badge).toBeInTheDocument();
      expect(badge.textContent).toBe("3");
    });
  });

  it("AC-2: should NOT show badge when unread count is 0", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ unreadCount: 0 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    // Wait for fetch to complete
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });

    expect(screen.queryByTestId("notification-badge")).not.toBeInTheDocument();
  });
});

// --- AC-3: List and Read (UI) ---

describe("Notifications / ListAndRead", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("AC-3: should display notification list when panel is opened", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("countOnly")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ unreadCount: 1 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: "n1",
              userId: "u1",
              type: "comment",
              title: "新しいコメント",
              message: "テストさんがあなたの投稿にコメントしました",
              referenceId: "post-1",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    // Wait for initial unread count load
    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    // Click bell to open panel
    fireEvent.click(screen.getByRole("button", { name: "通知" }));

    // Notification list should appear
    await waitFor(() => {
      expect(
        screen.getByText("テストさんがあなたの投稿にコメントしました")
      ).toBeInTheDocument();
    });
  });

  it("AC-3: should navigate to specific post when notification is clicked", async () => {
    const mockPush = vi.fn();
    const { useRouter } = await import("next/navigation");
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("countOnly")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ unreadCount: 1 }),
        });
      }
      if (url.includes("/api/notifications/read")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      if (url.includes("/api/posts/post-42")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ post: { communityId: "community-7" } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: "n1",
              userId: "u1",
              type: "comment",
              title: "新しいコメント",
              message: "テストさんがあなたの投稿「テスト」にコメントしました",
              referenceId: "post-42",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "通知" }));

    await waitFor(() => {
      expect(screen.getByTestId("notification-n1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("notification-n1"));

    // Should navigate to specific post with hash anchor
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        "/community/community-7#post-post-42"
      );
    });
  });

  it("AC-3: should call read API when notification is clicked", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("countOnly")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ unreadCount: 1 }),
        });
      }
      if (url.includes("/api/notifications/read")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      if (url.includes("/api/posts/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ post: { communityId: "c1" } }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: "n1",
              userId: "u1",
              type: "comment",
              title: "新しいコメント",
              message: "テストさんがコメントしました",
              referenceId: "post-1",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    // Open panel
    fireEvent.click(screen.getByRole("button", { name: "通知" }));

    // Wait for list
    await waitFor(() => {
      expect(
        screen.getByText("テストさんがコメントしました")
      ).toBeInTheDocument();
    });

    // Click notification
    fireEvent.click(screen.getByTestId("notification-n1"));

    // AC-3: Read API should be called
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/notifications/read",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ notificationId: "n1" }),
        })
      );
    });
  });

  it("AC-3: should mark as read only AFTER navigation succeeds", async () => {
    const mockPush = vi.fn();
    const { useRouter } = await import("next/navigation");
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    });

    const callOrder: string[] = [];
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("countOnly")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ unreadCount: 1 }),
        });
      }
      if (url.includes("/api/posts/post-1")) {
        callOrder.push("resolve-post");
        return Promise.resolve({
          ok: true,
          json: async () => ({ post: { communityId: "c1" } }),
        });
      }
      if (url.includes("/api/notifications/read")) {
        callOrder.push("mark-read");
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: "n1",
              userId: "u1",
              type: "comment",
              title: "コメント",
              message: "通知テスト",
              referenceId: "post-1",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "通知" }));

    await waitFor(() => {
      expect(screen.getByTestId("notification-n1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("notification-n1"));

    await waitFor(() => {
      expect(callOrder).toEqual(["resolve-post", "mark-read"]);
    });

    // Navigation must happen before mark-read
    expect(mockPush).toHaveBeenCalledWith("/community/c1#post-post-1");
  });

  it("AC-3: should NOT mark as read if post resolution fails", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("countOnly")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ unreadCount: 1 }),
        });
      }
      if (url.includes("/api/posts/")) {
        return Promise.reject(new Error("Network error"));
      }
      if (url.includes("/api/notifications/read")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: "n1",
              userId: "u1",
              type: "comment",
              title: "コメント",
              message: "通知テスト",
              referenceId: "post-1",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "通知" }));

    await waitFor(() => {
      expect(screen.getByTestId("notification-n1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("notification-n1"));

    // Wait for the click handler to complete
    await waitFor(() => {
      // Post resolution was attempted
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-1",
      );
    });

    // Read API should NOT have been called since post resolution failed
    const readCalls = fetchMock.mock.calls.filter(
      (call: string[]) =>
        typeof call[0] === "string" && call[0].includes("/api/notifications/read")
    );
    expect(readCalls).toHaveLength(0);

    // Badge should still show unread count
    expect(screen.getByTestId("notification-badge").textContent).toBe("1");
  });

  it("AC-3: opening panel should NOT automatically mark all as read", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("countOnly")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ unreadCount: 2 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          notifications: [
            {
              id: "n1",
              userId: "u1",
              type: "comment",
              title: "コメント",
              message: "通知1",
              referenceId: "post-1",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: "n2",
              userId: "u1",
              type: "reaction",
              title: "リアクション",
              message: "通知2",
              referenceId: "post-2",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const { NotificationBell } = await import(
      "@/components/notification/NotificationBell"
    );

    render(<NotificationBell />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("notification-badge")).toBeInTheDocument();
    });

    // Open panel
    fireEvent.click(screen.getByRole("button", { name: "通知" }));

    // Wait for list to load
    await waitFor(() => {
      expect(screen.getByText("通知1")).toBeInTheDocument();
    });

    // Badge should still show unread count (not auto-marked as read)
    expect(screen.getByTestId("notification-badge").textContent).toBe("2");

    // No markAllAsRead call should have been made
    const readCalls = fetchMock.mock.calls.filter(
      (call: string[]) =>
        typeof call[0] === "string" && call[0].includes("/api/notifications/read")
    );
    expect(readCalls).toHaveLength(0);
  });
});
