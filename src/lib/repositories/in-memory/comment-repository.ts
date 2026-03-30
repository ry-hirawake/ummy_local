import type { CommentEntity, CreateCommentInput } from "@/types/entities";
import type { CommentRepository } from "../types";

export class InMemoryCommentRepository implements CommentRepository {
  private comments: Map<string, CommentEntity> = new Map();
  private nextId = 1;

  async findById(id: string): Promise<CommentEntity | null> {
    return this.comments.get(id) ?? null;
  }

  async findByPostId(postId: string): Promise<CommentEntity[]> {
    return Array.from(this.comments.values())
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async create(input: CreateCommentInput): Promise<CommentEntity> {
    const now = new Date();
    const comment: CommentEntity = {
      id: `comment-${this.nextId++}`,
      postId: input.postId,
      authorId: input.authorId,
      parentCommentId: input.parentCommentId ?? null,
      content: input.content,
      createdAt: now,
      updatedAt: now,
    };
    this.comments.set(comment.id, comment);
    return comment;
  }

  async countByPostId(postId: string): Promise<number> {
    let count = 0;
    for (const c of this.comments.values()) {
      if (c.postId === postId) count++;
    }
    return count;
  }

  /** Direct insert with known id (for seeding). */
  seed(comment: CommentEntity): void {
    this.comments.set(comment.id, comment);
    const numId = parseInt(comment.id.replace("comment-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
