/**
 * Home Feed Page - Container Component
 * Manages state and orchestrates Presentational Components
 * AC-1: Types and mock data moved to shared modules
 * AC-2: Maintains existing feed display behavior
 * AC-3: Maintains reaction toggle behavior
 * AC-4: Maintains comments and reply input behavior
 * AC-5: All images use next/image
 */

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Post, ReactionType } from "@/types/post";
import { mockPosts, currentUserAvatar } from "@/lib/mock-data";
import { PostCard } from "@/components/home";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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
