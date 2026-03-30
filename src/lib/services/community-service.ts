import type {
  CommunityEntity,
  MembershipEntity,
} from "@/types/entities";
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok, fail } from "./types";
import { toSlug } from "@/lib/slug";

export interface CommunityWithMemberCount extends CommunityEntity {
  memberCount: number;
}

const MAX_NAME_LENGTH = 50;

export class CommunityService {
  constructor(private repos: Repositories) {}

  async getById(id: string): Promise<ServiceResult<CommunityWithMemberCount>> {
    const community = await this.repos.communities.findById(id);
    if (!community) return fail("NOT_FOUND", "コミュニティが見つかりません");
    const memberCount = await this.repos.memberships.countByCommunityId(id);
    return ok({ ...community, memberCount });
  }

  async getAll(): Promise<ServiceResult<CommunityWithMemberCount[]>> {
    const communities = await this.repos.communities.findAll();
    const result: CommunityWithMemberCount[] = [];
    for (const c of communities) {
      const memberCount = await this.repos.memberships.countByCommunityId(c.id);
      result.push({ ...c, memberCount });
    }
    return ok(result);
  }

  async create(
    input: { name: string; icon: string; description: string },
    creatorUserId: string
  ): Promise<ServiceResult<CommunityEntity>> {
    const trimmedName = input.name.trim();

    if (trimmedName.length === 0) {
      return fail("VALIDATION", "コミュニティ名は必須です");
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      return fail("VALIDATION", `コミュニティ名は${MAX_NAME_LENGTH}文字以内で入力してください`);
    }

    const slug = toSlug(trimmedName);
    const existing = await this.repos.communities.findBySlug(slug);
    if (existing) {
      return fail("CONFLICT", "同じ名前のコミュニティが既に存在します");
    }

    const community = await this.repos.communities.create({
      name: trimmedName,
      slug,
      icon: input.icon,
      description: input.description,
    });
    await this.repos.memberships.create(creatorUserId, community.id, "owner");
    return ok(community);
  }

  async getMembers(communityId: string): Promise<ServiceResult<MembershipEntity[]>> {
    const community = await this.repos.communities.findById(communityId);
    if (!community) return fail("NOT_FOUND", "コミュニティが見つかりません");
    const members = await this.repos.memberships.findByCommunityId(communityId);
    return ok(members);
  }

  async join(
    userId: string,
    communityId: string
  ): Promise<ServiceResult<MembershipEntity>> {
    const community = await this.repos.communities.findById(communityId);
    if (!community) return fail("NOT_FOUND", "コミュニティが見つかりません");

    const existing = await this.repos.memberships.findByUserAndCommunity(userId, communityId);
    if (existing) return fail("CONFLICT", "既にメンバーです");

    const membership = await this.repos.memberships.create(userId, communityId, "member");
    return ok(membership);
  }

  async leave(userId: string, communityId: string): Promise<ServiceResult<void>> {
    const deleted = await this.repos.memberships.delete(userId, communityId);
    if (!deleted) return fail("NOT_FOUND", "メンバーシップが見つかりません");
    return ok(undefined);
  }
}
