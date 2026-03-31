/**
 * CommentItem - Presentational Component for displaying comments
 * Props-only, no internal state (AC-1, AC-4 compliance)
 */

"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";
import type { Comment } from "@/types/post";
import { DEFAULT_AVATAR } from "@/lib/mock-data";

interface CommentItemProps {
  comment: Comment;
  isReply?: boolean;
  replyingTo: string | null;
  currentUserAvatar: string;
  onReplyToggle: (commentId: string) => void;
}

export function CommentItem({
  comment,
  isReply = false,
  replyingTo,
  currentUserAvatar,
  onReplyToggle,
}: CommentItemProps) {
  const isReplyInputOpen = replyingTo === comment.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isReply ? "ml-12 mt-3" : ""}`}
    >
      <Image
        src={comment.author.avatar || DEFAULT_AVATAR}
        alt={comment.author.name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="rounded-lg bg-secondary px-3 py-2">
          <h4 className="text-sm font-semibold">{comment.author.name}</h4>
          {comment.author.role && (
            <p className="text-xs text-muted-foreground">{comment.author.role}</p>
          )}
          <p className="mt-1 text-sm">{comment.content}</p>
        </div>
        <div className="mt-1 flex items-center gap-4 px-3 text-xs text-muted-foreground">
          <button className="transition-colors hover:text-primary">
            いいね
          </button>
          <button
            className="transition-colors hover:text-primary"
            onClick={() => onReplyToggle(comment.id)}
          >
            返信
          </button>
          <span>{comment.timestamp}</span>
          {comment.likes > 0 && <span>👍 {comment.likes}</span>}
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {isReplyInputOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex gap-2"
            >
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
                  placeholder="返信を入力..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all focus:border-primary/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-primary p-2 text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply={true}
                replyingTo={replyingTo}
                currentUserAvatar={currentUserAvatar}
                onReplyToggle={onReplyToggle}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
