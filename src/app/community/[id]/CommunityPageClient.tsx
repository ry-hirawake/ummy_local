/**
 * Community Detail Page - Client Container
 * Manages client-side interaction state for the community feed UI.
 */

"use client";

import { useState, useCallback } from "react";
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
  communityId?: string;
  initialMembership?: boolean;
}

export function CommunityPageClient({
  community,
  communityId,
  initialMembership = true,
}: CommunityPageClientProps): React.ReactElement {
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(initialMembership);
  const [memberCount, setMemberCount] = useState(community.members);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handleJoinToggle = useCallback(async () => {
    if (isSubmitting || !communityId) {
      // If communityId is not provided, fall back to local state toggle
      if (!communityId) {
        setIsJoined(!isJoined);
      }
      return;
    }

    setIsSubmitting(true);
    const wasJoined = isJoined;
    const previousMemberCount = memberCount;

    // Optimistic update
    setIsJoined(!wasJoined);
    setMemberCount(wasJoined ? memberCount - 1 : memberCount + 1);

    try {
      const response = await fetch(`/api/communities/${communityId}/members`, {
        method: wasJoined ? "DELETE" : "POST",
      });

      if (!response.ok) {
        const status = response.status;
        // Handle idempotency: 409 means already joined, 404 means already left
        if (status === 409) {
          // Already joined - UI should reflect joined state
          // memberCount stays at previousMemberCount (user was already counted)
          setIsJoined(true);
          setMemberCount(previousMemberCount);
        } else if (status === 404) {
          // Already left - UI should reflect not joined state
          // memberCount stays at optimistic value (user was already not counted)
          // So we don't rollback memberCount here
          setIsJoined(false);
        } else {
          // Other errors - rollback
          setIsJoined(wasJoined);
          setMemberCount(previousMemberCount);
        }
      }
    } catch {
      // Network error - rollback optimistic update
      setIsJoined(wasJoined);
      setMemberCount(previousMemberCount);
    } finally {
      setIsSubmitting(false);
    }
  }, [isJoined, isSubmitting, communityId, memberCount]);

  // Create a community info object with updated member count
  const communityWithUpdatedCount: CommunityInfo = {
    ...community,
    members: memberCount,
  };

  const handlePostSubmit = useCallback(
    async (content: string) => {
      if (isPostSubmitting || !communityId) return;

      setIsPostSubmitting(true);
      setPostError(null);

      try {
        const response = await fetch(`/api/communities/${communityId}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          const data = await response.json();
          setPostError(data.error || "投稿の作成に失敗しました");
          return;
        }

        const data = await response.json();
        const newPost: CommunityPost = {
          id: data.post.id,
          author: data.post.author || {
            name: "あなた",
            role: "",
            avatar: currentUserAvatar,
          },
          content: data.post.content,
          timestamp: "たった今",
          likes: 0,
          comments: 0,
          shares: 0,
          reactions: data.post.reactions || {
            thumbsUp: 0,
            partyPopper: 0,
            lightbulb: 0,
            laugh: 0,
          },
        };

        // Add new post at the top of the feed
        setPosts([newPost, ...posts]);
      } catch {
        setPostError("ネットワークエラーが発生しました");
      } finally {
        setIsPostSubmitting(false);
      }
    },
    [isPostSubmitting, communityId, posts]
  );

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
        community={communityWithUpdatedCount}
        isJoined={isJoined}
        onJoinToggle={handleJoinToggle}
      />

      <div className="mx-auto max-w-4xl px-6 py-6">
        {isJoined && (
          <CreatePostInput
            communityName={community.name}
            currentUserAvatar={currentUserAvatar}
            onSubmit={handlePostSubmit}
            isSubmitting={isPostSubmitting}
            error={postError}
          />
        )}

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
