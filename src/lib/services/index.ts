/**
 * Service factory.
 * Singleton pattern aligned with auth-provider.ts and repository factory.
 */

import { getRepositories } from "@/lib/repositories";
import { UserService } from "./user-service";
import { CommunityService } from "./community-service";
import { PostService } from "./post-service";
import { CommentService } from "./comment-service";
import { ReactionService } from "./reaction-service";
import { NotificationService } from "./notification-service";
import { SearchService } from "./search-service";

export interface Services {
  users: UserService;
  communities: CommunityService;
  posts: PostService;
  comments: CommentService;
  reactions: ReactionService;
  notifications: NotificationService;
  search: SearchService;
}

let instance: Services | null = null;

export function getServices(): Services {
  if (instance) return instance;

  const repos = getRepositories();
  instance = {
    users: new UserService(repos),
    communities: new CommunityService(repos),
    posts: new PostService(repos),
    comments: new CommentService(repos),
    reactions: new ReactionService(repos),
    notifications: new NotificationService(repos),
    search: new SearchService(repos),
  };

  return instance;
}

/** Reset singleton (for testing). */
export function resetServices(): void {
  instance = null;
}

export { UserService } from "./user-service";
export { CommunityService } from "./community-service";
export { PostService } from "./post-service";
export { CommentService } from "./comment-service";
export { ReactionService } from "./reaction-service";
export { NotificationService } from "./notification-service";
export { SearchService } from "./search-service";
