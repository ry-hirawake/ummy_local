import type { ReactionEntity, CreateReactionInput, ReactionType } from "@/types/entities";
import type { ReactionRepository } from "../types";

const REACTION_TYPES: ReactionType[] = ["thumbsUp", "partyPopper", "lightbulb", "laugh"];

export class InMemoryReactionRepository implements ReactionRepository {
  private reactions: Map<string, ReactionEntity> = new Map();
  private nextId = 1;

  async findByPostId(postId: string): Promise<ReactionEntity[]> {
    return Array.from(this.reactions.values()).filter(
      (r) => r.postId === postId
    );
  }

  async findByUserAndPost(
    userId: string,
    postId: string
  ): Promise<ReactionEntity | null> {
    for (const r of this.reactions.values()) {
      if (r.userId === userId && r.postId === postId) return r;
    }
    return null;
  }

  async create(input: CreateReactionInput): Promise<ReactionEntity> {
    const reaction: ReactionEntity = {
      id: `reaction-${this.nextId++}`,
      postId: input.postId,
      userId: input.userId,
      type: input.type,
      createdAt: new Date(),
    };
    this.reactions.set(reaction.id, reaction);
    return reaction;
  }

  async update(
    userId: string,
    postId: string,
    type: ReactionType
  ): Promise<ReactionEntity | null> {
    for (const [key, r] of this.reactions.entries()) {
      if (r.userId === userId && r.postId === postId) {
        const updated: ReactionEntity = { ...r, type };
        this.reactions.set(key, updated);
        return updated;
      }
    }
    return null;
  }

  async delete(userId: string, postId: string): Promise<boolean> {
    for (const [key, r] of this.reactions.entries()) {
      if (r.userId === userId && r.postId === postId) {
        this.reactions.delete(key);
        return true;
      }
    }
    return false;
  }

  async countByPostId(postId: string): Promise<Record<ReactionType, number>> {
    const counts: Record<ReactionType, number> = {
      thumbsUp: 0,
      partyPopper: 0,
      lightbulb: 0,
      laugh: 0,
    };
    for (const r of this.reactions.values()) {
      if (r.postId === postId && REACTION_TYPES.includes(r.type)) {
        counts[r.type]++;
      }
    }
    return counts;
  }

  /** Direct insert with known id (for seeding). */
  seed(reaction: ReactionEntity): void {
    this.reactions.set(reaction.id, reaction);
    const numId = parseInt(reaction.id.replace("reaction-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
