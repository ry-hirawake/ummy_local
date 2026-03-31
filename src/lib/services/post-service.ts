import type {
  PostEntity,
  CreatePostInput,
  UserEntity,
  ReactionType,
} from "@/types/entities";
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok, fail } from "./types";

export interface EnrichedPost extends PostEntity {
  author: UserEntity;
  reactions: Record<ReactionType, number>;
  commentCount: number;
  userReaction?: ReactionType;
  community?: { name: string; icon: string };
}

export class PostService {
  constructor(private repos: Repositories) {}

  async getById(
    postId: string,
    currentUserId?: string
  ): Promise<ServiceResult<EnrichedPost>> {
    const post = await this.repos.posts.findById(postId);
    if (!post) return fail("NOT_FOUND", "投稿が見つかりません");

    const enriched = await this.enrichPost(post, currentUserId);
    return ok(enriched);
  }

  async getByCommunityId(
    communityId: string,
    currentUserId?: string
  ): Promise<ServiceResult<EnrichedPost[]>> {
    const community = await this.repos.communities.findById(communityId);
    if (!community) return fail("NOT_FOUND", "コミュニティが見つかりません");

    const posts = await this.repos.posts.findByCommunityId(communityId);
    const enriched: EnrichedPost[] = [];
    for (const post of posts) {
      enriched.push(await this.enrichPost(post, currentUserId));
    }
    return ok(enriched);
  }

  async getAll(currentUserId?: string): Promise<ServiceResult<EnrichedPost[]>> {
    const posts = await this.repos.posts.findAll();
    const enriched: EnrichedPost[] = [];
    for (const post of posts) {
      enriched.push(await this.enrichPost(post, currentUserId, true));
    }
    return ok(enriched);
  }

  async updatePin(
    postId: string,
    userId: string,
    isPinned: boolean
  ): Promise<ServiceResult<PostEntity>> {
    const post = await this.repos.posts.findById(postId);
    if (!post) return fail("NOT_FOUND", "投稿が見つかりません");

    const membership = await this.repos.memberships.findByUserAndCommunity(
      userId,
      post.communityId
    );
    if (!membership || membership.role !== "owner") {
      return fail("FORBIDDEN", "ピン留め操作はコミュニティ作成者のみ可能です");
    }

    // EC-1: Only one pinned post per community — unpin existing
    if (isPinned) {
      const communityPosts = await this.repos.posts.findByCommunityId(
        post.communityId
      );
      for (const p of communityPosts) {
        if (p.isPinned && p.id !== postId) {
          await this.repos.posts.update(p.id, { isPinned: false });
        }
      }
    }

    const updated = await this.repos.posts.update(postId, { isPinned });
    if (!updated) return fail("NOT_FOUND", "投稿の更新に失敗しました");
    return ok(updated);
  }

  async create(input: CreatePostInput): Promise<ServiceResult<PostEntity>> {
    // Validate content
    const trimmedContent = input.content.trim();
    if (trimmedContent.length === 0) {
      return fail("VALIDATION", "投稿内容は必須です");
    }
    if (trimmedContent.length > 2000) {
      return fail("VALIDATION", "投稿内容は2000文字以内で入力してください");
    }

    // Check community exists
    const community = await this.repos.communities.findById(input.communityId);
    if (!community) return fail("NOT_FOUND", "コミュニティが見つかりません");

    // Check membership (EC-1: non-members cannot post)
    const membership = await this.repos.memberships.findByUserAndCommunity(
      input.authorId,
      input.communityId
    );
    if (!membership) {
      return fail("FORBIDDEN", "コミュニティに参加していないため投稿できません");
    }

    const post = await this.repos.posts.create({
      ...input,
      content: trimmedContent,
    });
    return ok(post);
  }

  private async enrichPost(
    post: PostEntity,
    currentUserId?: string,
    includeCommunity = false
  ): Promise<EnrichedPost> {
    const author = await this.repos.users.findById(post.authorId);
    const reactions = await this.repos.reactions.countByPostId(post.id);
    const commentCount = await this.repos.comments.countByPostId(post.id);

    let userReaction: ReactionType | undefined;
    if (currentUserId) {
      const reaction = await this.repos.reactions.findByUserAndPost(
        currentUserId,
        post.id
      );
      if (reaction) userReaction = reaction.type;
    }

    let community: { name: string; icon: string } | undefined;
    if (includeCommunity) {
      const communityEntity = await this.repos.communities.findById(post.communityId);
      if (communityEntity) {
        community = { name: communityEntity.name, icon: communityEntity.icon };
      }
    }

    return {
      ...post,
      author: author!,
      reactions,
      commentCount,
      userReaction,
      community,
    };
  }
}
