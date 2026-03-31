/**
 * SearchService - Search functionality for posts and communities
 * Story-0015: AC-1, AC-2, AC-3
 */

// Entity types used internally by repository methods
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok } from "./types";

export interface PostSearchResult {
  id: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  community: {
    id: string;
    name: string;
    icon: string;
  };
  createdAt: Date;
}

export interface CommunitySearchResult {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  memberCount: number;
  createdAt: Date;
}

export interface SearchResults {
  posts: PostSearchResult[];
  communities: CommunitySearchResult[];
}

/**
 * Normalize string for search matching:
 * - Trim whitespace
 * - NFKC normalization (Unicode)
 * - Lowercase for case-insensitive matching
 */
function normalizeForSearch(text: string): string {
  return text.trim().normalize("NFKC").toLowerCase();
}

/**
 * Check if target contains query (after normalization)
 */
function matchesQuery(target: string, normalizedQuery: string): boolean {
  const normalizedTarget = normalizeForSearch(target);
  return normalizedTarget.includes(normalizedQuery);
}

/**
 * Create excerpt from content (first 100 chars)
 */
function createExcerpt(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
}

export class SearchService {
  constructor(private repos: Repositories) {}

  async search(query: string): Promise<ServiceResult<SearchResults>> {
    const normalizedQuery = normalizeForSearch(query);

    if (!normalizedQuery) {
      return ok({ posts: [], communities: [] });
    }

    // Search posts and communities in parallel
    const [posts, communities] = await Promise.all([
      this.searchPosts(normalizedQuery),
      this.searchCommunities(normalizedQuery),
    ]);

    return ok({ posts, communities });
  }

  private async searchPosts(normalizedQuery: string): Promise<PostSearchResult[]> {
    const allPosts = await this.repos.posts.findAll();

    // Filter posts matching query
    const matchingPosts = allPosts.filter((post) =>
      matchesQuery(post.content, normalizedQuery)
    );

    // Sort by newest first (AC-3)
    matchingPosts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Enrich with author and community info
    const results: PostSearchResult[] = [];
    for (const post of matchingPosts) {
      const [author, community] = await Promise.all([
        this.repos.users.findById(post.authorId),
        this.repos.communities.findById(post.communityId),
      ]);

      if (author && community) {
        results.push({
          id: post.id,
          content: post.content,
          excerpt: createExcerpt(post.content),
          author: {
            id: author.id,
            name: author.name,
            avatar: author.avatar,
          },
          community: {
            id: community.id,
            name: community.name,
            icon: community.icon,
          },
          createdAt: post.createdAt,
        });
      }
    }

    return results;
  }

  private async searchCommunities(
    normalizedQuery: string
  ): Promise<CommunitySearchResult[]> {
    const allCommunities = await this.repos.communities.findAll();

    // Filter communities matching query (name or description)
    const matchingCommunities = allCommunities.filter(
      (community) =>
        matchesQuery(community.name, normalizedQuery) ||
        matchesQuery(community.description, normalizedQuery)
    );

    // Sort by newest first (AC-3)
    matchingCommunities.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Enrich with member count
    const results: CommunitySearchResult[] = [];
    for (const community of matchingCommunities) {
      const memberCount = await this.repos.memberships.countByCommunityId(
        community.id
      );
      results.push({
        id: community.id,
        name: community.name,
        slug: community.slug,
        icon: community.icon,
        description: community.description,
        memberCount,
        createdAt: community.createdAt,
      });
    }

    return results;
  }
}
