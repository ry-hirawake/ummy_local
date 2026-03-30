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

  async create(input: CreatePostInput): Promise<ServiceResult<PostEntity>> {
    const community = await this.repos.communities.findById(input.communityId);
    if (!community) return fail("NOT_FOUND", "コミュニティが見つかりません");

    const post = await this.repos.posts.create(input);
    return ok(post);
  }

  private async enrichPost(
    post: PostEntity,
    currentUserId?: string
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

    return {
      ...post,
      author: author!,
      reactions,
      commentCount,
      userReaction,
    };
  }
}
