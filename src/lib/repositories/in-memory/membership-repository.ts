import type { MembershipEntity, MembershipRole } from "@/types/entities";
import type { MembershipRepository } from "../types";

export class InMemoryMembershipRepository implements MembershipRepository {
  private memberships: Map<string, MembershipEntity> = new Map();
  private nextId = 1;

  async findByCommunityId(communityId: string): Promise<MembershipEntity[]> {
    return Array.from(this.memberships.values()).filter(
      (m) => m.communityId === communityId
    );
  }

  async findByUserId(userId: string): Promise<MembershipEntity[]> {
    return Array.from(this.memberships.values()).filter(
      (m) => m.userId === userId
    );
  }

  async findByUserAndCommunity(
    userId: string,
    communityId: string
  ): Promise<MembershipEntity | null> {
    for (const m of this.memberships.values()) {
      if (m.userId === userId && m.communityId === communityId) return m;
    }
    return null;
  }

  async create(
    userId: string,
    communityId: string,
    role: MembershipRole
  ): Promise<MembershipEntity> {
    const membership: MembershipEntity = {
      id: `membership-${this.nextId++}`,
      userId,
      communityId,
      role,
      joinedAt: new Date(),
    };
    this.memberships.set(membership.id, membership);
    return membership;
  }

  async delete(userId: string, communityId: string): Promise<boolean> {
    for (const [key, m] of this.memberships.entries()) {
      if (m.userId === userId && m.communityId === communityId) {
        this.memberships.delete(key);
        return true;
      }
    }
    return false;
  }

  async countByCommunityId(communityId: string): Promise<number> {
    let count = 0;
    for (const m of this.memberships.values()) {
      if (m.communityId === communityId) count++;
    }
    return count;
  }

  /** Direct insert with known id (for seeding). */
  seed(membership: MembershipEntity): void {
    this.memberships.set(membership.id, membership);
    const numId = parseInt(membership.id.replace("membership-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
