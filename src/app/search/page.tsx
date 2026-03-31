/**
 * Search Page
 * Story-0015: Search posts and communities
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Search, Users, FileText } from "lucide-react";
import { DEFAULT_AVATAR } from "@/lib/mock-data";

interface PostSearchResult {
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
  createdAt: string;
}

interface CommunitySearchResult {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  memberCount: number;
  createdAt: string;
}

interface SearchResults {
  posts: PostSearchResult[];
  communities: CommunitySearchResult[];
}

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "たった今";
  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString("ja-JP");
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) {
        throw new Error("検索に失敗しました");
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-search when initial query parameter exists
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  const totalResults =
    (results?.posts.length || 0) + (results?.communities.length || 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-4 text-2xl font-bold">検索</h1>
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="投稿やコミュニティを検索..."
              className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </form>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-border/50 bg-card p-4"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/6 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {/* Results Summary */}
            <p className="mb-6 text-sm text-muted-foreground">
              {totalResults > 0
                ? `${totalResults}件の結果が見つかりました`
                : ""}
            </p>

            {/* Empty State (AC-3) */}
            {totalResults === 0 && (
              <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">該当結果はありません</p>
                <p className="mt-2 text-sm text-muted-foreground/70">
                  別のキーワードで検索してみてください
                </p>
              </div>
            )}

            {/* Community Results (AC-2) */}
            {results.communities.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5" />
                  コミュニティ
                  <span className="text-sm font-normal text-muted-foreground">
                    ({results.communities.length}件)
                  </span>
                </h2>
                <div className="space-y-3">
                  {results.communities.map((community, index) => (
                    <motion.div
                      key={community.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/community/${community.id}`}
                        className="block rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 text-2xl">
                            {community.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{community.name}</h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {community.description}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {community.memberCount}人のメンバー
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Post Results (AC-1) */}
            {results.posts.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <FileText className="h-5 w-5" />
                  投稿
                  <span className="text-sm font-normal text-muted-foreground">
                    ({results.posts.length}件)
                  </span>
                </h2>
                <div className="space-y-3">
                  {results.posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/community/${post.community.id}`}
                        className="block rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md"
                      >
                        <div className="flex items-start gap-3">
                          <Image
                            src={post.author.avatar || DEFAULT_AVATAR}
                            alt={post.author.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {post.author.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                in {post.community.icon} {post.community.name}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {formatTimestamp(post.createdAt)}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}

        {/* Initial State (before search) */}
        {!isLoading && !error && !hasSearched && (
          <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              キーワードを入力して検索してください
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
