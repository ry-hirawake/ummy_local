import type { CommentEntity, CreateCommentInput, UserEntity } from "@/types/entities";
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok, fail } from "./types";

export interface CommentWithAuthor extends CommentEntity {
  author: UserEntity;
}

export interface NestedComment extends CommentWithAuthor {
  replies: NestedComment[];
}

export class CommentService {
  constructor(private repos: Repositories) {}

  async getByPostId(postId: string): Promise<ServiceResult<NestedComment[]>> {
    const post = await this.repos.posts.findById(postId);
    if (!post) return fail("NOT_FOUND", "投稿が見つかりません");

    const comments = await this.repos.comments.findByPostId(postId);
    const withAuthors: CommentWithAuthor[] = [];
    for (const comment of comments) {
      const author = await this.repos.users.findById(comment.authorId);
      withAuthors.push({ ...comment, author: author! });
    }

    const nested = this.buildTree(withAuthors);
    return ok(nested);
  }

  async create(input: CreateCommentInput): Promise<ServiceResult<CommentEntity>> {
    const post = await this.repos.posts.findById(input.postId);
    if (!post) return fail("NOT_FOUND", "投稿が見つかりません");

    if (input.parentCommentId) {
      const parent = await this.repos.comments.findById(input.parentCommentId);
      if (!parent) return fail("NOT_FOUND", "親コメントが見つかりません");
    }

    const comment = await this.repos.comments.create(input);
    return ok(comment);
  }

  private buildTree(comments: CommentWithAuthor[]): NestedComment[] {
    const map = new Map<string, NestedComment>();
    const roots: NestedComment[] = [];

    for (const c of comments) {
      map.set(c.id, { ...c, replies: [] });
    }

    for (const c of comments) {
      const node = map.get(c.id)!;
      if (c.parentCommentId && map.has(c.parentCommentId)) {
        map.get(c.parentCommentId)!.replies.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}
