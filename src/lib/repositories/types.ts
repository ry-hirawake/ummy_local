/**
 * Repository interface definitions.
 * All data access goes through these abstractions.
 */

import type {
  UserEntity,
  CommunityEntity,
  MembershipEntity,
  PostEntity,
  CommentEntity,
  ReactionEntity,
  NotificationEntity,
  CreateUserInput,
  CreateCommunityInput,
  UpdateCommunityInput,
  CreatePostInput,
  UpdatePostInput,
  CreateCommentInput,
  CreateReactionInput,
  CreateNotificationInput,
  ReactionType,
} from "@/types/entities";

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(input: CreateUserInput): Promise<UserEntity>;
}

export interface CommunityRepository {
  findById(id: string): Promise<CommunityEntity | null>;
  findBySlug(slug: string): Promise<CommunityEntity | null>;
  findAll(): Promise<CommunityEntity[]>;
  create(input: CreateCommunityInput): Promise<CommunityEntity>;
  update(id: string, input: UpdateCommunityInput): Promise<CommunityEntity | null>;
}

export interface MembershipRepository {
  findByCommunityId(communityId: string): Promise<MembershipEntity[]>;
  findByUserId(userId: string): Promise<MembershipEntity[]>;
  findByUserAndCommunity(userId: string, communityId: string): Promise<MembershipEntity | null>;
  create(userId: string, communityId: string, role: MembershipEntity["role"]): Promise<MembershipEntity>;
  delete(userId: string, communityId: string): Promise<boolean>;
  countByCommunityId(communityId: string): Promise<number>;
}

export interface PostRepository {
  findById(id: string): Promise<PostEntity | null>;
  findByCommunityId(communityId: string): Promise<PostEntity[]>;
  findAll(): Promise<PostEntity[]>;
  create(input: CreatePostInput): Promise<PostEntity>;
  update(id: string, input: UpdatePostInput): Promise<PostEntity | null>;
  delete(id: string): Promise<boolean>;
}

export interface CommentRepository {
  findById(id: string): Promise<CommentEntity | null>;
  findByPostId(postId: string): Promise<CommentEntity[]>;
  create(input: CreateCommentInput): Promise<CommentEntity>;
  countByPostId(postId: string): Promise<number>;
}

export interface ReactionRepository {
  findByPostId(postId: string): Promise<ReactionEntity[]>;
  findByUserAndPost(userId: string, postId: string): Promise<ReactionEntity | null>;
  create(input: CreateReactionInput): Promise<ReactionEntity>;
  update(userId: string, postId: string, type: ReactionType): Promise<ReactionEntity | null>;
  delete(userId: string, postId: string): Promise<boolean>;
  countByPostId(postId: string): Promise<Record<ReactionType, number>>;
}

export interface NotificationRepository {
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  countUnreadByUserId(userId: string): Promise<number>;
  create(input: CreateNotificationInput): Promise<NotificationEntity>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<number>;
}

export interface Repositories {
  users: UserRepository;
  communities: CommunityRepository;
  memberships: MembershipRepository;
  posts: PostRepository;
  comments: CommentRepository;
  reactions: ReactionRepository;
  notifications: NotificationRepository;
}
