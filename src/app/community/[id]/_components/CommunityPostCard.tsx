/**
 * CommunityPostCard - Presentational Component for community posts
 * Props-only, delegates state changes to callbacks (Story-0012 compliance)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Pin,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Send,
} from "lucide-react";
import { CommentItem } from "@/components/home/CommentItem";
import { reactionIcons } from "@/lib/reactions";
import { DEFAULT_AVATAR } from "@/lib/mock-data";
import type { CommunityPost, CommunityReactionType } from "../_data";

interface CommunityPostCardProps {
  post: CommunityPost;
  index: number;
  showReactions: boolean;
  expandedComments: boolean;
  replyingTo: string | null;
  currentUserAvatar: string;
  onReactionToggle: () => void;
  onReactionSelect: (reactionType: CommunityReactionType) => void;
  onCommentsToggle: () => void;
  onReplyToggle: (commentId: string) => void;
  onCommentSubmit?: (postId: string, content: string) => Promise<void>;
  onReplySubmit?: (postId: string, commentId: string, content: string) => Promise<void>;
}

export function CommunityPostCard({
  post,
  index,
  showReactions,
  expandedComments,
  replyingTo,
  currentUserAvatar,
  onReactionToggle,
  onReactionSelect,
  onCommentsToggle,
  onReplyToggle,
  onCommentSubmit,
  onReplySubmit,
}: CommunityPostCardProps) {
  const hasReactions = Object.values(post.reactions).some((count) => count > 0);
  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async () => {
    if (!commentContent.trim() || isSubmitting || !onCommentSubmit) return;

    setIsSubmitting(true);
    try {
      await onCommentSubmit(post.id, commentContent.trim());
      setCommentContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId: string, content: string) => {
    if (!onReplySubmit) return;
    await onReplySubmit(post.id, commentId, content);
  };

  return (
    <motion.article
      key={post.id}
      id={`post-${post.id}`}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm transition-all hover:shadow-md"
    >
      {/* Pinned Indicator */}
      {post.isPinned && (
        <div className="flex items-center gap-2 border-b border-border/50 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
          <Pin className="h-3.5 w-3.5" />
          ピン留めされた投稿
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Image
              src={post.author.avatar || DEFAULT_AVATAR}
              alt={post.author.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
          </motion.div>
          <div>
            <h3 className="text-sm font-semibold">{post.author.name}</h3>
            {post.author.role && (
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            )}
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="rounded-full p-1.5 transition-all hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="whitespace-pre-line text-sm leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Reaction Summary */}
      {hasReactions && (
        <div className="border-t border-border/50 px-4 py-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="flex -space-x-1">
              {Object.entries(post.reactions).map(([type, count]) => {
                if (count > 0) {
                  const ReactionIcon =
                    reactionIcons[type as CommunityReactionType].icon;
                  return (
                    <div
                      key={type}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary ring-2 ring-card"
                    >
                      <ReactionIcon
                        className={`h-3 w-3 ${
                          reactionIcons[type as CommunityReactionType].color
                        }`}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <span className="ml-1">{totalReactions}</span>
            <span className="ml-auto">
              {post.comments}件のコメント • {post.shares}回共有
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1 border-t border-border/50 p-2">
        <div className="relative flex-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReactionToggle}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-secondary ${
              post.userReaction ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {post.userReaction ? (
              <>
                {(() => {
                  const ReactionIcon =
                    reactionIcons[post.userReaction as CommunityReactionType].icon;
                  return <ReactionIcon className="h-4 w-4" />;
                })()}
                <span className="font-medium">
                  {reactionIcons[post.userReaction as CommunityReactionType].label}
                </span>
              </>
            ) : (
              <>
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">リアクション</span>
              </>
            )}
          </motion.button>

          {/* Reaction Popup */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl"
              >
                <div className="flex gap-1">
                  {Object.entries(reactionIcons).map(
                    ([type, { icon: Icon, label, color }]) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.2, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onReactionSelect(type as CommunityReactionType)}
                        className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all hover:bg-secondary ${
                          post.userReaction === type ? "bg-secondary" : ""
                        }`}
                        title={label}
                      >
                        <Icon className={`h-6 w-6 ${color}`} />
                      </motion.button>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCommentsToggle}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">コメント</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary"
        >
          <Share2 className="h-4 w-4" />
          <span className="font-medium">共有</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-secondary"
        >
          <Bookmark className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {expandedComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 bg-muted/30 p-4"
          >
            {post.commentList && post.commentList.length > 0 && (
              <div className="space-y-4">
                {post.commentList.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    replyingTo={replyingTo}
                    currentUserAvatar={currentUserAvatar}
                    onReplyToggle={onReplyToggle}
                    onReplySubmit={handleReplySubmit}
                  />
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            <div className={`flex gap-3 ${post.commentList && post.commentList.length > 0 ? "mt-4 border-t border-border/50 pt-4" : ""}`}>
              <Image
                src={currentUserAvatar}
                alt="Your avatar"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  placeholder="コメントを追加..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all focus:border-primary/50 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCommentSubmit}
                  disabled={isSubmitting || !commentContent.trim()}
                  className="rounded-lg bg-primary p-2 text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
