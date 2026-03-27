/**
 * Community Detail Page - Container Component
 * Manages state and delegates UI to Presentational Components (AC-1 compliance)
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { motion } from "motion/react";

import { CommunityHeader, CreatePostInput, CommunityPostCard } from "./_components";
import {
  getCommunityById,
  mockCommunityPosts,
  currentUserAvatar,
  type CommunityPost,
  type CommunityReactionType,
} from "./_data";

export default function CommunityPage() {
  const params = useParams();
  const id = params.id as string;

  // AC-4: Check for valid community ID
  const community = getCommunityById(id);
  if (!community) {
    notFound();
  }

  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(true);

  // AC-3: Handle reaction selection
  const handleReaction = (postId: string, reactionType: CommunityReactionType) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };

          // Remove previous reaction if exists
          if (post.userReaction) {
            newReactions[post.userReaction as CommunityReactionType]--;
          }

          // Toggle or set new reaction
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

  // AC-3: Toggle comments visibility
  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  // AC-3: Toggle reply input
  const handleReplyToggle = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* AC-2: Community Header */}
      <CommunityHeader
        community={community}
        isJoined={isJoined}
        onJoinToggle={() => setIsJoined(!isJoined)}
      />

      {/* Community Content */}
      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Create Post Input */}
        <CreatePostInput
          communityName={community.name}
          currentUserAvatar={currentUserAvatar}
        />

        {/* AC-2: Post List with pinned posts first */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              index={index}
              showReactions={showReactions === post.id}
              expandedComments={expandedComments === post.id}
              replyingTo={replyingTo}
              currentUserAvatar={currentUserAvatar}
              onReactionToggle={() =>
                setShowReactions(showReactions === post.id ? null : post.id)
              }
              onReactionSelect={(reactionType) => handleReaction(post.id, reactionType)}
              onCommentsToggle={() => toggleComments(post.id)}
              onReplyToggle={handleReplyToggle}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
