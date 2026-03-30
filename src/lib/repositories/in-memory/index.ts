/**
 * In-memory repository barrel + factory.
 */

import type { Repositories } from "../types";
import { InMemoryUserRepository } from "./user-repository";
import { InMemoryCommunityRepository } from "./community-repository";
import { InMemoryMembershipRepository } from "./membership-repository";
import { InMemoryPostRepository } from "./post-repository";
import { InMemoryCommentRepository } from "./comment-repository";
import { InMemoryReactionRepository } from "./reaction-repository";
import { InMemoryNotificationRepository } from "./notification-repository";
import { seedRepositories } from "./seed";

export function createInMemoryRepositories(): Repositories {
  const repos = {
    users: new InMemoryUserRepository(),
    communities: new InMemoryCommunityRepository(),
    memberships: new InMemoryMembershipRepository(),
    posts: new InMemoryPostRepository(),
    comments: new InMemoryCommentRepository(),
    reactions: new InMemoryReactionRepository(),
    notifications: new InMemoryNotificationRepository(),
  };
  seedRepositories(repos);
  return repos;
}

export {
  InMemoryUserRepository,
  InMemoryCommunityRepository,
  InMemoryMembershipRepository,
  InMemoryPostRepository,
  InMemoryCommentRepository,
  InMemoryReactionRepository,
  InMemoryNotificationRepository,
};
