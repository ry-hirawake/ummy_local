import type { CommunityEntity, CreateCommunityInput, UpdateCommunityInput } from "@/types/entities";
import type { CommunityRepository } from "../types";

export class InMemoryCommunityRepository implements CommunityRepository {
  private communities: Map<string, CommunityEntity> = new Map();
  private nextId = 1;

  async findById(id: string): Promise<CommunityEntity | null> {
    return this.communities.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<CommunityEntity | null> {
    for (const community of this.communities.values()) {
      if (community.slug === slug) return community;
    }
    return null;
  }

  async findAll(): Promise<CommunityEntity[]> {
    return Array.from(this.communities.values());
  }

  async create(input: CreateCommunityInput): Promise<CommunityEntity> {
    const now = new Date();
    const community: CommunityEntity = {
      id: `community-${this.nextId++}`,
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.communities.set(community.id, community);
    return community;
  }

  async update(id: string, input: UpdateCommunityInput): Promise<CommunityEntity | null> {
    const existing = this.communities.get(id);
    if (!existing) return null;
    const updated: CommunityEntity = {
      ...existing,
      ...input,
      updatedAt: new Date(),
    };
    this.communities.set(id, updated);
    return updated;
  }

  /** Direct insert with known id (for seeding). */
  seed(community: CommunityEntity): void {
    this.communities.set(community.id, community);
    const numId = parseInt(community.id.replace("community-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
