/**
 * API Foundation Integration Tests (Story-0018)
 *
 * AC-1: Core entity types exist with required fields and relations
 * AC-2: Route Handlers access data only through Service layer; auth required
 * AC-3: Default config is in-memory; no secrets in NEXT_PUBLIC_*
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createInMemoryRepositories } from "@/lib/repositories/in-memory";
import { getConfig, resetConfig } from "@/lib/config";
import { UserService } from "@/lib/services/user-service";
import { CommunityService } from "@/lib/services/community-service";
import { PostService } from "@/lib/services/post-service";
import { CommentService } from "@/lib/services/comment-service";
import { ReactionService } from "@/lib/services/reaction-service";
import { NotificationService } from "@/lib/services/notification-service";
import type { Repositories } from "@/lib/repositories/types";
import type {
  UserEntity,
  CommunityEntity,
  MembershipEntity,
  PostEntity,
  CommentEntity,
  ReactionEntity,
  NotificationEntity,
} from "@/types/entities";

// ============================================================
// AC-1: Core Entity Types
// ============================================================
describe("AC-1: Core entity type definitions", () => {
  it("UserEntity has required fields", () => {
    const user: UserEntity = {
      id: "user-1",
      email: "test@example.com",
      name: "Test User",
      role: "Developer",
      avatar: "https://example.com/avatar.jpg",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.name).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it("CommunityEntity has required fields", () => {
    const community: CommunityEntity = {
      id: "community-1",
      name: "Test Community",
      icon: "📢",
      description: "A test community",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(community.id).toBeDefined();
    expect(community.name).toBeDefined();
  });

  it("MembershipEntity relates User to Community", () => {
    const membership: MembershipEntity = {
      id: "membership-1",
      userId: "user-1",
      communityId: "community-1",
      role: "member",
      joinedAt: new Date(),
    };
    expect(membership.userId).toBe("user-1");
    expect(membership.communityId).toBe("community-1");
    expect(["owner", "admin", "member"]).toContain(membership.role);
  });

  it("PostEntity has authorId and communityId relations", () => {
    const post: PostEntity = {
      id: "post-1",
      authorId: "user-1",
      communityId: "community-1",
      content: "Hello world",
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(post.authorId).toBe("user-1");
    expect(post.communityId).toBe("community-1");
  });

  it("CommentEntity supports nested comments via parentCommentId", () => {
    const rootComment: CommentEntity = {
      id: "comment-1",
      postId: "post-1",
      authorId: "user-1",
      parentCommentId: null,
      content: "Root comment",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const reply: CommentEntity = {
      id: "comment-2",
      postId: "post-1",
      authorId: "user-2",
      parentCommentId: "comment-1",
      content: "Reply",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(rootComment.parentCommentId).toBeNull();
    expect(reply.parentCommentId).toBe("comment-1");
  });

  it("ReactionEntity enforces postId + userId relation with ReactionType", () => {
    const reaction: ReactionEntity = {
      id: "reaction-1",
      postId: "post-1",
      userId: "user-1",
      type: "thumbsUp",
      createdAt: new Date(),
    };
    expect(reaction.postId).toBe("post-1");
    expect(reaction.userId).toBe("user-1");
    expect(["thumbsUp", "partyPopper", "lightbulb", "laugh"]).toContain(reaction.type);
  });

  it("NotificationEntity has userId and notification metadata", () => {
    const notification: NotificationEntity = {
      id: "notification-1",
      userId: "user-1",
      type: "reaction",
      title: "New reaction",
      message: "Someone reacted",
      referenceId: "post-1",
      isRead: false,
      createdAt: new Date(),
    };
    expect(notification.userId).toBe("user-1");
    expect(notification.isRead).toBe(false);
    expect(["reaction", "comment", "mention", "membership"]).toContain(notification.type);
  });
});

// ============================================================
// AC-2: Service Layer (API boundary behavior)
// ============================================================
describe("AC-2: Service layer and data access", () => {
  let repos: Repositories;

  beforeEach(() => {
    repos = createInMemoryRepositories();
  });

  describe("UserService", () => {
    it("retrieves seeded user by id", async () => {
      const service = new UserService(repos);
      const result = await service.getById("user-1");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("田中 美咲");
      }
    });

    it("returns NOT_FOUND for unknown user", async () => {
      const service = new UserService(repos);
      const result = await service.getById("user-999");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("CommunityService", () => {
    it("retrieves all seeded communities with member counts", async () => {
      const service = new CommunityService(repos);
      const result = await service.getAll();
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBeGreaterThanOrEqual(5);
        expect(result.data[0].memberCount).toBeGreaterThan(0);
      }
    });

    it("creates a community and assigns creator as owner", async () => {
      const service = new CommunityService(repos);
      const result = await service.create(
        { name: "New Community", icon: "🆕", description: "Test" },
        "user-1"
      );
      expect(result.success).toBe(true);
      if (result.success) {
        const membership = await repos.memberships.findByUserAndCommunity(
          "user-1",
          result.data.id
        );
        expect(membership?.role).toBe("owner");
      }
    });

    it("prevents duplicate membership on join", async () => {
      const service = new CommunityService(repos);
      // user-1 is already a member of community-1 via seed
      const result = await service.join("user-1", "community-1");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CONFLICT");
      }
    });
  });

  describe("PostService", () => {
    it("retrieves posts by community with enrichment", async () => {
      const service = new PostService(repos);
      const result = await service.getByCommunityId("community-4", "user-2");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBeGreaterThan(0);
        const post = result.data[0];
        expect(post.author).toBeDefined();
        expect(post.author.name).toBeDefined();
        expect(post.reactions).toBeDefined();
        expect(typeof post.commentCount).toBe("number");
      }
    });

    it("creates a post with communityId", async () => {
      const service = new PostService(repos);
      const result = await service.create({
        authorId: "user-1",
        communityId: "community-1",
        content: "New post content",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.communityId).toBe("community-1");
      }
    });

    it("fails to create post in non-existent community", async () => {
      const service = new PostService(repos);
      const result = await service.create({
        authorId: "user-1",
        communityId: "community-999",
        content: "This should fail",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("CommentService", () => {
    it("returns nested comment tree", async () => {
      const service = new CommentService(repos);
      const result = await service.getByPostId("post-1");
      expect(result.success).toBe(true);
      if (result.success) {
        // post-1 has root comments and replies
        expect(result.data.length).toBeGreaterThan(0);
        const rootWithReplies = result.data.find((c) => c.replies.length > 0);
        expect(rootWithReplies).toBeDefined();
        expect(rootWithReplies!.author).toBeDefined();
      }
    });

    it("creates a comment on a post", async () => {
      const service = new CommentService(repos);
      const result = await service.create({
        postId: "post-1",
        authorId: "user-2",
        content: "New comment",
      });
      expect(result.success).toBe(true);
    });

    it("fails for non-existent parent comment", async () => {
      const service = new CommentService(repos);
      const result = await service.create({
        postId: "post-1",
        authorId: "user-1",
        parentCommentId: "comment-999",
        content: "Reply to nothing",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("ReactionService", () => {
    it("counts reactions by post", async () => {
      const service = new ReactionService(repos);
      const result = await service.getByPostId("post-1");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.thumbsUp).toBe("number");
        expect(typeof result.data.partyPopper).toBe("number");
      }
    });

    it("adds a new reaction", async () => {
      const service = new ReactionService(repos);
      const result = await service.addOrUpdate("user-1", "post-1", "laugh");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("laugh");
      }
    });

    it("updates existing reaction type (1 user, 1 post, 1 reaction)", async () => {
      const service = new ReactionService(repos);
      // user-2 already has thumbsUp on post-1 from seed
      const result = await service.addOrUpdate("user-2", "post-1", "partyPopper");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe("partyPopper");
      }

      // Verify only one reaction exists for this user+post
      const allReactions = await repos.reactions.findByPostId("post-1");
      const userReactions = allReactions.filter((r) => r.userId === "user-2");
      expect(userReactions.length).toBe(1);
    });

    it("removes a reaction", async () => {
      const service = new ReactionService(repos);
      const result = await service.remove("user-2", "post-1");
      expect(result.success).toBe(true);
    });
  });

  describe("NotificationService", () => {
    it("retrieves notifications for a user", async () => {
      const service = new NotificationService(repos);
      const result = await service.getByUserId("user-1");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.length).toBeGreaterThan(0);
      }
    });

    it("marks a notification as read", async () => {
      const service = new NotificationService(repos);
      const result = await service.markAsRead("notification-1");
      expect(result.success).toBe(true);

      const notifications = await service.getByUserId("user-1");
      if (notifications.success) {
        const n = notifications.data.find((n) => n.id === "notification-1");
        expect(n?.isRead).toBe(true);
      }
    });

    it("marks all notifications as read", async () => {
      const service = new NotificationService(repos);
      const result = await service.markAllAsRead("user-1");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeGreaterThan(0);
      }
    });
  });
});

// ============================================================
// AC-3: Environment Configuration
// ============================================================
describe("AC-3: Environment configuration", () => {
  beforeEach(() => {
    resetConfig();
  });

  it("defaults to in-memory provider", () => {
    const config = getConfig();
    expect(config.provider).toBe("in-memory");
    expect(config.database).toBeUndefined();
  });

  it("in-memory repositories are seeded and functional", async () => {
    const repos = createInMemoryRepositories();
    const users = await repos.users.findAll();
    expect(users.length).toBeGreaterThanOrEqual(3);

    const communities = await repos.communities.findAll();
    expect(communities.length).toBeGreaterThanOrEqual(5);

    const posts = await repos.posts.findByCommunityId("community-4");
    expect(posts.length).toBeGreaterThan(0);
  });
});
