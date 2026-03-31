/**
 * Community Detail Page - Client Container
 * Manages client-side interaction state for the community feed UI.
 * Story-0011: Fetches posts from API with chronological ordering and pinned post support.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import { CommunityHeader, CreatePostInput, CommunityPostCard } from "./_components";
import {
  currentUserAvatar,
  type CommunityInfo,
  type CommunityPost,
  type CommunityReactionType,
} from "./_data";

interface ApiPost {
  id: string;
  content: string;
  createdAt: string;
  isPinned?: boolean;
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

function apiPostToCommunityPost(apiPost: ApiPost): CommunityPost {
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
    isPinned: apiPost.isPinned,
    createdAt: apiPost.createdAt,
  };
}

interface CommunityPageClientProps {
  community: CommunityInfo;
  communityId?: string;
  initialMembership?: boolean;
  initialPosts?: CommunityPost[];
  userRole?: "owner" | "admin" | "member";
}

export function CommunityPageClient({
  community,
  communityId,
  initialMembership = true,
  initialPosts,
  userRole,
}: CommunityPageClientProps): React.ReactElement {
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts ?? []);
  const [isLoading, setIsLoading] = useState(!initialPosts && !!communityId);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(initialMembership);
  const [memberCount, setMemberCount] = useState(community.members);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Fetch posts from API (only when communityId is provided and no initialPosts)
  const fetchPosts = useCallback(async () => {
    if (!communityId) return;

    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await fetch(`/api/communities/${communityId}/posts`);
      if (!response.ok) {
        throw new Error("投稿の取得に失敗しました");
      }
      const data = await response.json();
      const fetchedPosts = (data.posts ?? []).map(apiPostToCommunityPost);

      // Sort: pinned posts first, then by newest
      // (API already returns sorted by createdAt desc, but we ensure pinned is at top)
      fetchedPosts.sort((a: CommunityPost, b: CommunityPost) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });

      setPosts(fetchedPosts);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    // Only fetch if we don't have initial posts and have a communityId
    if (!initialPosts && communityId) {
      fetchPosts();
    }
  }, [fetchPosts, initialPosts, communityId]);

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
          createdAt: data.post.createdAt || new Date().toISOString(),
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

  // Story-0013: Reaction handler with API integration and optimistic update
  const handleReaction = useCallback(
    async (postId: string, reactionType: CommunityReactionType) => {
      // Find the current post state for rollback
      const currentPost = posts.find((p) => p.id === postId);
      if (!currentPost) return;

      const previousReactions = { ...currentPost.reactions };
      const previousUserReaction = currentPost.userReaction;

      // Calculate new state
      const newReactions = { ...currentPost.reactions };
      const isRemoving = currentPost.userReaction === reactionType;

      if (currentPost.userReaction) {
        newReactions[currentPost.userReaction as CommunityReactionType]--;
      }

      if (!isRemoving) {
        newReactions[reactionType]++;
      }

      const newUserReaction = isRemoving ? undefined : reactionType;

      // Optimistic update
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, reactions: newReactions, userReaction: newUserReaction }
            : post
        )
      );
      setShowReactions(null);

      // API call
      try {
        if (isRemoving) {
          // DELETE to remove reaction
          const response = await fetch(`/api/posts/${postId}/reactions`, {
            method: "DELETE",
          });
          if (!response.ok && response.status !== 404) {
            throw new Error("Failed to remove reaction");
          }
        } else {
          // POST to add/update reaction
          const response = await fetch(`/api/posts/${postId}/reactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: reactionType }),
          });
          if (!response.ok) {
            throw new Error("Failed to add reaction");
          }
        }
      } catch {
        // EC-2: Rollback on network failure
        setPosts(
          posts.map((post) =>
            post.id === postId
              ? { ...post, reactions: previousReactions, userReaction: previousUserReaction }
              : post
          )
        );
      }
    },
    [posts]
  );

  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  const handleReplyToggle = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  // Story-0012: Comment submission handler
  const handleCommentSubmit = useCallback(
    async (postId: string, content: string) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("コメントの作成に失敗しました");
      }

      const data = await response.json();

      // Update posts with new comment and increment comment count
      setPosts(
        posts.map((post) => {
          if (post.id !== postId) return post;
          const newComment = {
            id: data.comment.id,
            author: {
              name: "あなた", // Will be replaced with actual user data
              avatar: currentUserAvatar,
            },
            content: data.comment.content,
            timestamp: "たった今",
            likes: 0,
          };
          return {
            ...post,
            comments: post.comments + 1,
            commentList: [...(post.commentList || []), newComment],
          };
        })
      );
    },
    [posts]
  );

  // Story-0012: Reply submission handler
  const handleReplySubmit = useCallback(
    async (postId: string, commentId: string, content: string) => {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentCommentId: commentId }),
      });

      if (!response.ok) {
        throw new Error("返信の作成に失敗しました");
      }

      const data = await response.json();

      // Update posts with new reply
      setPosts(
        posts.map((post) => {
          if (post.id !== postId) return post;
          const newReply = {
            id: data.comment.id,
            author: {
              name: "あなた",
              avatar: currentUserAvatar,
            },
            content: data.comment.content,
            timestamp: "たった今",
            likes: 0,
          };
          return {
            ...post,
            comments: post.comments + 1,
            commentList: (post.commentList || []).map((comment) => {
              if (comment.id !== commentId) return comment;
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
              };
            }),
          };
        })
      );
    },
    [posts]
  );

  // Story-0017: Pin toggle handler with optimistic update
  const canPin = userRole === "owner";

  const handlePinToggle = useCallback(
    async (postId: string, shouldPin: boolean) => {
      if (!communityId) return;

      const previousPosts = [...posts];

      // Optimistic update: set isPinned and re-sort
      setPosts((current) => {
        const updated = current.map((p) => {
          if (p.id === postId) return { ...p, isPinned: shouldPin };
          // If pinning a new post, unpin the old one
          if (shouldPin && p.isPinned) return { ...p, isPinned: false };
          return p;
        });
        // Sort: pinned first, then by createdAt descending (newest first)
        return updated.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          // Restore chronological order using createdAt
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
      });

      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPinned: shouldPin }),
        });

        if (!response.ok) {
          // Rollback on failure
          setPosts(previousPosts);
        }
      } catch {
        // Rollback on network error
        setPosts(previousPosts);
      }
    },
    [communityId, posts]
  );

  // Loading state
  if (isLoading) {
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
      </motion.div>
    );
  }

  // Error state
  if (fetchError) {
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
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{fetchError}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              再試行
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

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

        {posts.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
            <p className="text-muted-foreground">
              まだ投稿がありません。最初の投稿を作成してみましょう！
            </p>
          </div>
        ) : (
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
                canPin={canPin}
                onPinToggle={handlePinToggle}
                onReactionToggle={() =>
                  setShowReactions(showReactions === post.id ? null : post.id)
                }
                onReactionSelect={(reactionType) => handleReaction(post.id, reactionType)}
                onCommentsToggle={() => toggleComments(post.id)}
                onReplyToggle={handleReplyToggle}
                onCommentSubmit={handleCommentSubmit}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
