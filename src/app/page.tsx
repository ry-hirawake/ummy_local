/**
 * Home Feed Page - Container Component
 * Manages state and orchestrates Presentational Components
 * AC-1: Types and mock data moved to shared modules
 * AC-2: Maintains existing feed display behavior
 * AC-3: Maintains reaction toggle behavior
 * AC-4: Maintains comments and reply input behavior
 * AC-5: All images use next/image
 * Story-0009 AC-4: Fetches posts from API for aggregated feed
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import type { Post, ReactionType } from "@/types/post";
import { currentUserAvatar } from "@/lib/mock-data";
import { PostCard } from "@/components/home";

interface ApiPost {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  reactions: {
    thumbsUp: number;
    partyPopper: number;
    lightbulb: number;
    laugh: number;
  };
  commentCount: number;
  userReaction?: string;
  community?: {
    name: string;
    icon: string;
  };
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

function apiPostToPost(apiPost: ApiPost): Post {
  return {
    id: apiPost.id,
    author: {
      name: apiPost.author.name,
      role: apiPost.author.role,
      avatar: apiPost.author.avatar,
    },
    content: apiPost.content,
    timestamp: formatTimestamp(apiPost.createdAt),
    likes: Object.values(apiPost.reactions).reduce((a, b) => a + b, 0),
    comments: apiPost.commentCount,
    shares: 0,
    reactions: apiPost.reactions,
    userReaction: apiPost.userReaction,
    community: apiPost.community
      ? `${apiPost.community.icon} ${apiPost.community.name}`
      : undefined,
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("投稿の取得に失敗しました");
      }
      const data = await response.json();
      setPosts(data.posts.map(apiPostToPost));
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleReactionToggle = (postId: string) => {
    setShowReactions(showReactions === postId ? null : postId);
  };

  const handleReactionSelect = (postId: string, reactionType: ReactionType) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };

          // Remove previous reaction if exists
          if (post.userReaction) {
            newReactions[post.userReaction as ReactionType]--;
          }

          // Add new reaction or clear if same
          if (post.userReaction !== reactionType) {
            newReactions[reactionType]++;
            return { ...post, reactions: newReactions, userReaction: reactionType };
          }

          return { ...post, reactions: newReactions, userReaction: undefined };
        }
        return post;
      })
    );
    setShowReactions(null);
  };

  const handleCommentsToggle = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  const handleReplyToggle = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-border/50 bg-card p-6"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/4 rounded bg-muted" />
                    <div className="h-3 w-1/6 rounded bg-muted" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              再試行
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
            <p className="text-muted-foreground">
              まだ投稿がありません。コミュニティに参加して投稿してみましょう！
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Feed */}
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-6">
          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                showReactions={showReactions === post.id}
                isCommentsExpanded={expandedComments === post.id}
                replyingTo={replyingTo}
                currentUserAvatar={currentUserAvatar}
                onReactionToggle={handleReactionToggle}
                onReactionSelect={handleReactionSelect}
                onCommentsToggle={handleCommentsToggle}
                onReplyToggle={handleReplyToggle}
              />
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-secondary"
            >
              さらに読み込む
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
