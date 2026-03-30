/**
 * Community Detail Page - Client Container
 * Manages client-side interaction state for the community feed UI.
 */

"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CommunityHeader, CreatePostInput, CommunityPostCard } from "./_components";
import {
  mockCommunityPosts,
  currentUserAvatar,
  type CommunityInfo,
  type CommunityPost,
  type CommunityReactionType,
} from "./_data";

interface CommunityPageClientProps {
  community: CommunityInfo;
}

export function CommunityPageClient({
  community,
}: CommunityPageClientProps): React.ReactElement {
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(true);

  const handleReaction = (postId: string, reactionType: CommunityReactionType) => {
    setPosts(
      posts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const newReactions = { ...post.reactions };

        if (post.userReaction) {
          newReactions[post.userReaction as CommunityReactionType]--;
        }

        if (post.userReaction !== reactionType) {
          newReactions[reactionType]++;
          return { ...post, reactions: newReactions, userReaction: reactionType };
        }

        return { ...post, reactions: newReactions, userReaction: undefined };
      })
    );
    setShowReactions(null);
  };

  const toggleComments = (postId: string) => {
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
      <CommunityHeader
        community={community}
        isJoined={isJoined}
        onJoinToggle={() => setIsJoined(!isJoined)}
      />

      <div className="mx-auto max-w-4xl px-6 py-6">
        <CreatePostInput
          communityName={community.name}
          currentUserAvatar={currentUserAvatar}
        />

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
