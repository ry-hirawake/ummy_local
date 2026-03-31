import type { ReactionEntity, ReactionType } from "@/types/entities";
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok, fail } from "./types";

export class ReactionService {
  constructor(private repos: Repositories) {}

  async getByPostId(
    postId: string
  ): Promise<ServiceResult<Record<ReactionType, number>>> {
    const post = await this.repos.posts.findById(postId);
    if (!post) return fail("NOT_FOUND", "投稿が見つかりません");
    const counts = await this.repos.reactions.countByPostId(postId);
    return ok(counts);
  }

  /**
   * Add or change a reaction. 1 user, 1 post, 1 reaction.
   * If user already reacted with same type → no-op.
   * If user already reacted with different type → update.
   * If no existing reaction → create.
   */
  async addOrUpdate(
    userId: string,
    postId: string,
    type: ReactionType
  ): Promise<ServiceResult<ReactionEntity>> {
    const post = await this.repos.posts.findById(postId);
    if (!post) return fail("NOT_FOUND", "投稿が見つかりません");

    const existing = await this.repos.reactions.findByUserAndPost(userId, postId);

    if (existing) {
      if (existing.type === type) return ok(existing);
      const updated = await this.repos.reactions.update(userId, postId, type);
      return ok(updated!);
    }

    const reaction = await this.repos.reactions.create({ postId, userId, type });

    // Story-0016: Generate notification for post author on new reaction (EC-1: skip self-reaction)
    if (userId !== post.authorId) {
      const reactor = await this.repos.users.findById(userId);
      const userName = reactor?.name ?? "ユーザー";
      const postSnippet = post.content.length > 20 ? post.content.slice(0, 20) + "…" : post.content;
      await this.repos.notifications.create({
        userId: post.authorId,
        type: "reaction",
        title: "新しいリアクション",
        message: `${userName}さんがあなたの投稿「${postSnippet}」にリアクションしました`,
        referenceId: post.id,
      });
    }

    return ok(reaction);
  }

  async remove(userId: string, postId: string): Promise<ServiceResult<void>> {
    const deleted = await this.repos.reactions.delete(userId, postId);
    if (!deleted) return fail("NOT_FOUND", "リアクションが見つかりません");
    return ok(undefined);
  }
}
