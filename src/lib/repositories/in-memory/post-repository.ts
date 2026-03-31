import type { PostEntity, CreatePostInput, UpdatePostInput } from "@/types/entities";
import type { PostRepository } from "../types";

export class InMemoryPostRepository implements PostRepository {
  private posts: Map<string, PostEntity> = new Map();
  private nextId = 1;

  async findById(id: string): Promise<PostEntity | null> {
    return this.posts.get(id) ?? null;
  }

  async findByCommunityId(communityId: string): Promise<PostEntity[]> {
    return Array.from(this.posts.values())
      .filter((p) => p.communityId === communityId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findAll(): Promise<PostEntity[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(input: CreatePostInput): Promise<PostEntity> {
    const now = new Date();
    const post: PostEntity = {
      id: `post-${this.nextId++}`,
      authorId: input.authorId,
      communityId: input.communityId,
      content: input.content,
      isPinned: input.isPinned ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.posts.set(post.id, post);
    return post;
  }

  async update(id: string, input: UpdatePostInput): Promise<PostEntity | null> {
    const existing = this.posts.get(id);
    if (!existing) return null;
    const updated: PostEntity = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };
    this.posts.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.posts.delete(id);
  }

  /** Direct insert with known id (for seeding). */
  seed(post: PostEntity): void {
    this.posts.set(post.id, post);
    const numId = parseInt(post.id.replace("post-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
