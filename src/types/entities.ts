/**
 * Domain entity type definitions for Ummy persistence layer.
 * These are separate from UI types (post.ts, community types).
 * Used by Repository and Service layers.
 */

// --- Enums / Literal Types ---

export type ReactionType = "thumbsUp" | "partyPopper" | "lightbulb" | "laugh";

export type MembershipRole = "owner" | "admin" | "member";

export type NotificationType =
  | "reaction"
  | "comment"
  | "mention"
  | "membership";

// --- Core Entities ---

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  role: string; // job title / position
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityEntity {
  id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipEntity {
  id: string;
  userId: string;
  communityId: string;
  role: MembershipRole;
  joinedAt: Date;
}

export interface PostEntity {
  id: string;
  authorId: string;
  communityId: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentEntity {
  id: string;
  postId: string;
  authorId: string;
  parentCommentId: string | null; // adjacency list for nesting
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReactionEntity {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  createdAt: Date;
}

export interface NotificationEntity {
  id: string;
  userId: string; // recipient
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string | null; // post/comment/community id
  isRead: boolean;
  createdAt: Date;
}

// --- Input Types (for create/update) ---

export interface CreateUserInput {
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface CreateCommunityInput {
  name: string;
  icon: string;
  description: string;
}

export interface UpdateCommunityInput {
  name?: string;
  icon?: string;
  description?: string;
}

export interface CreatePostInput {
  authorId: string;
  communityId: string;
  content: string;
  isPinned?: boolean;
}

export interface UpdatePostInput {
  content?: string;
  isPinned?: boolean;
}

export interface CreateCommentInput {
  postId: string;
  authorId: string;
  parentCommentId?: string | null;
  content: string;
}

export interface CreateReactionInput {
  postId: string;
  userId: string;
  type: ReactionType;
}

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string | null;
}
