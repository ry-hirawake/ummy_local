/**
 * Comments Integration Tests
 * Tests for comment and reply creation functionality.
 *
 * Story Mapping (tracked in SSOT):
 * - Story-0012: AC-1 (CreateComment), AC-2 (CreateReply), AC-3 (DisplayMetadata)
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

// Story-0012: AC-1 Comment Creation
describe("Comments / CreateComment", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should create comment and display it in the list", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        comment: {
          id: "new-comment-1",
          postId: "post-1",
          authorId: "u1",
          content: "新しいコメントです",
          parentCommentId: null,
          createdAt: new Date().toISOString(),
        },
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
        commentList: [],
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

    // Expand comments section
    fireEvent.click(screen.getByText("コメント"));

    // Find comment input and enter text
    const commentInput = screen.getByPlaceholderText("コメントを追加...");
    fireEvent.change(commentInput, { target: { value: "新しいコメントです" } });

    // Submit comment - find button next to input (within the same container)
    const inputContainer = commentInput.parentElement;
    const sendButton = inputContainer?.querySelector("button");
    expect(sendButton).toBeTruthy();
    fireEvent.click(sendButton!);

    // AC-1: Comment is saved via API
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-1/comments",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ content: "新しいコメントです" }),
        })
      );
    });
  });

  it("should increment comment count after successful comment creation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        comment: {
          id: "new-comment-1",
          postId: "post-1",
          authorId: "u1",
          content: "コメント",
          parentCommentId: null,
          createdAt: new Date().toISOString(),
        },
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
        comments: 2,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [],
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

    // Initially shows 2 comments
    expect(screen.getByText("2件のコメント • 0回共有")).toBeInTheDocument();

    // Expand and submit comment
    fireEvent.click(screen.getByText("コメント"));
    const commentInput = screen.getByPlaceholderText("コメントを追加...");
    fireEvent.change(commentInput, { target: { value: "新コメント" } });

    // Submit comment - find button next to input
    const inputContainer = commentInput.parentElement;
    const sendButton = inputContainer?.querySelector("button");
    fireEvent.click(sendButton!);

    // AC-1: Comment count increases by 1
    await waitFor(() => {
      expect(screen.getByText("3件のコメント • 0回共有")).toBeInTheDocument();
    });
  });

  it("should not submit empty comment (EC-1)", async () => {
    const fetchMock = vi.fn();
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
        commentList: [],
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

    fireEvent.click(screen.getByText("コメント"));

    // Try to submit empty comment - find button next to input
    const commentInput = screen.getByPlaceholderText("コメントを追加...");
    const inputContainer = commentInput.parentElement;
    const sendButton = inputContainer?.querySelector("button");
    fireEvent.click(sendButton!);

    // EC-1: Empty comment should not trigger API call
    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalledWith(
        "/api/posts/post-1/comments",
        expect.anything()
      );
    });
  });
});

// Story-0012: AC-2 Reply Creation
describe("Comments / CreateReply", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should create reply under specific comment", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        comment: {
          id: "new-reply-1",
          postId: "post-1",
          authorId: "u1",
          content: "返信です",
          parentCommentId: "comment-1",
          createdAt: new Date().toISOString(),
        },
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
        comments: 1,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "コメント者",
              role: "デザイナー",
              avatar: "https://example.com/commenter.jpg",
            },
            content: "既存コメント",
            timestamp: "30分前",
            likes: 2,
          },
        ],
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

    // Expand comments
    fireEvent.click(screen.getByText("コメント"));

    // Click reply button on comment
    const replyButton = screen.getByText("返信");
    fireEvent.click(replyButton);

    // Enter reply
    const replyInput = screen.getByPlaceholderText("返信を入力...");
    fireEvent.change(replyInput, { target: { value: "返信です" } });

    // Find and click send button for reply (the one next to reply input)
    const replyInputContainer = replyInput.parentElement;
    const replySendButton = replyInputContainer?.querySelector("button");
    fireEvent.click(replySendButton!);

    // AC-2: Reply is created with parentCommentId
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/posts/post-1/comments",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            content: "返信です",
            parentCommentId: "comment-1",
          }),
        })
      );
    });
  });

  it("should not show reply button for replies (1-level nesting only)", async () => {
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
        comments: 2,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "コメント者",
              role: "デザイナー",
              avatar: "https://example.com/commenter.jpg",
            },
            content: "親コメント",
            timestamp: "30分前",
            likes: 2,
            replies: [
              {
                id: "reply-1",
                author: {
                  name: "返信者",
                  role: "エンジニア",
                  avatar: "https://example.com/replier.jpg",
                },
                content: "これは返信です",
                timestamp: "15分前",
                likes: 1,
              },
            ],
          },
        ],
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

    // Expand comments
    fireEvent.click(screen.getByText("コメント"));

    // Should see the reply content
    expect(screen.getByText("これは返信です")).toBeInTheDocument();

    // AC-2: Reply should not have a reply button (1-level nesting)
    const replyButtons = screen.getAllByText("返信");
    // Only parent comment should have reply button, not the nested reply
    expect(replyButtons.length).toBe(1);
  });
});

// Story-0012: Server-side Validation (EC-1, AC-2)
describe("Comments / ServerSideValidation", () => {
  it("should reject empty content at service level (EC-1)", async () => {
    const { CommentService } = await import("@/lib/services/comment-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create a user and post first
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

    const service = new CommentService(repos);

    // EC-1: Empty content should be rejected
    const emptyResult = await service.create({
      postId: post.id,
      authorId: "u1",
      content: "",
      parentCommentId: null,
    });
    expect(emptyResult.success).toBe(false);
    if (!emptyResult.success) {
      expect(emptyResult.error.code).toBe("VALIDATION");
    }

    // EC-1: Whitespace-only content should be rejected
    const whitespaceResult = await service.create({
      postId: post.id,
      authorId: "u1",
      content: "   ",
      parentCommentId: null,
    });
    expect(whitespaceResult.success).toBe(false);
    if (!whitespaceResult.success) {
      expect(whitespaceResult.error.code).toBe("VALIDATION");
    }
  });

  it("should reject reply-to-reply at service level (AC-2)", async () => {
    const { CommentService } = await import("@/lib/services/comment-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create user, community membership, and post
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

    const service = new CommentService(repos);

    // Create a parent comment
    const parentResult = await service.create({
      postId: post.id,
      authorId: "u1",
      content: "Parent comment",
      parentCommentId: null,
    });
    expect(parentResult.success).toBe(true);
    const parentComment = parentResult.success ? parentResult.data : null;

    // Create a reply to the parent
    const replyResult = await service.create({
      postId: post.id,
      authorId: "u1",
      content: "Reply to parent",
      parentCommentId: parentComment!.id,
    });
    expect(replyResult.success).toBe(true);
    const reply = replyResult.success ? replyResult.data : null;

    // AC-2: Try to create a reply to the reply (should fail)
    const replyToReplyResult = await service.create({
      postId: post.id,
      authorId: "u1",
      content: "Reply to reply",
      parentCommentId: reply!.id,
    });
    expect(replyToReplyResult.success).toBe(false);
    if (!replyToReplyResult.success) {
      expect(replyToReplyResult.error.code).toBe("VALIDATION");
      expect(replyToReplyResult.error.message).toBe("返信への返信はできません");
    }
  });

  it("should reject cross-post parent comment at service level (AC-2)", async () => {
    const { CommentService } = await import("@/lib/services/comment-service");
    const { createInMemoryRepositories } = await import(
      "@/lib/repositories/in-memory"
    );
    const repos = createInMemoryRepositories();

    // Create user
    await repos.users.create({
      id: "u1",
      email: "test@example.com",
      name: "Test User",
      avatar: "/test.png",
      role: "",
      createdAt: new Date(),
    });

    // Create two posts in different (or same) communities
    const post1 = await repos.posts.create({
      communityId: "c1",
      authorId: "u1",
      content: "Post 1",
    });
    const post2 = await repos.posts.create({
      communityId: "c1",
      authorId: "u1",
      content: "Post 2",
    });

    const service = new CommentService(repos);

    // Create a comment on post1
    const commentResult = await service.create({
      postId: post1.id,
      authorId: "u1",
      content: "Comment on post 1",
      parentCommentId: null,
    });
    expect(commentResult.success).toBe(true);
    const comment = commentResult.success ? commentResult.data : null;

    // AC-2: Try to create a reply on post2 with parent from post1 (should fail)
    const crossPostReplyResult = await service.create({
      postId: post2.id,
      authorId: "u1",
      content: "Cross-post reply",
      parentCommentId: comment!.id,
    });
    expect(crossPostReplyResult.success).toBe(false);
    if (!crossPostReplyResult.success) {
      expect(crossPostReplyResult.error.code).toBe("VALIDATION");
      expect(crossPostReplyResult.error.message).toBe(
        "親コメントは同じ投稿に属している必要があります"
      );
    }
  });
});

// Story-0012: AC-3 Display Metadata
describe("Comments / DisplayMetadata", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should display author name, avatar, timestamp, and content for comments", async () => {
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
        comments: 1,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "山田 太郎",
              role: "プロダクトマネージャー",
              avatar: "https://example.com/yamada.jpg",
            },
            content: "素晴らしい投稿ですね！",
            timestamp: "30分前",
            likes: 5,
          },
        ],
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

    // Expand comments
    fireEvent.click(screen.getByText("コメント"));

    // AC-3: Author name is displayed
    expect(screen.getByText("山田 太郎")).toBeInTheDocument();

    // AC-3: Avatar is displayed
    const avatar = screen.getByAltText("山田 太郎");
    expect(avatar).toBeInTheDocument();

    // AC-3: Timestamp is displayed
    expect(screen.getByText("30分前")).toBeInTheDocument();

    // AC-3: Content is displayed
    expect(screen.getByText("素晴らしい投稿ですね！")).toBeInTheDocument();
  });

  it("should display metadata for replies", async () => {
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
        comments: 2,
        shares: 0,
        reactions: { thumbsUp: 5, partyPopper: 0, lightbulb: 0, laugh: 0 },
        commentList: [
          {
            id: "comment-1",
            author: {
              name: "コメント者",
              role: "デザイナー",
              avatar: "https://example.com/commenter.jpg",
            },
            content: "コメント内容",
            timestamp: "30分前",
            likes: 2,
            replies: [
              {
                id: "reply-1",
                author: {
                  name: "返信者 花子",
                  role: "エンジニア",
                  avatar: "https://example.com/hanako.jpg",
                },
                content: "返信の内容です",
                timestamp: "10分前",
                likes: 1,
              },
            ],
          },
        ],
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

    // Expand comments
    fireEvent.click(screen.getByText("コメント"));

    // AC-3: Reply author name is displayed
    expect(screen.getByText("返信者 花子")).toBeInTheDocument();

    // AC-3: Reply avatar is displayed
    const avatar = screen.getByAltText("返信者 花子");
    expect(avatar).toBeInTheDocument();

    // AC-3: Reply timestamp is displayed
    expect(screen.getByText("10分前")).toBeInTheDocument();

    // AC-3: Reply content is displayed
    expect(screen.getByText("返信の内容です")).toBeInTheDocument();
  });
});
