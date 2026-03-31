/**
 * CreatePostInput - Presentational Component for post creation input
 * Props-only component (AC-1 compliance)
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Send } from "lucide-react";

const MAX_CONTENT_LENGTH = 2000;

interface CreatePostInputProps {
  communityName: string;
  currentUserAvatar: string;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function CreatePostInput({
  communityName,
  currentUserAvatar,
  onSubmit,
  isSubmitting = false,
  error = null,
}: CreatePostInputProps) {
  const [content, setContent] = useState("");

  const trimmedContent = content.trim();
  const isOverLimit = content.length > MAX_CONTENT_LENGTH;
  const isValid = trimmedContent.length > 0 && !isOverLimit;
  const canSubmit = isValid && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onSubmit(trimmedContent);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-4 overflow-hidden rounded-lg border border-border/50 bg-card p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <Image
          src={currentUserAvatar}
          alt="Your avatar"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            placeholder={`${communityName}で共有...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOverLimit && (
                <span className="text-xs text-destructive">
                  2000文字以内で入力してください
                </span>
              )}
              {error && (
                <span className="text-xs text-destructive">{error}</span>
              )}
              {!isOverLimit && !error && content.length > 0 && (
                <span
                  className={`text-xs ${
                    content.length > MAX_CONTENT_LENGTH * 0.9
                      ? "text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {content.length}/{MAX_CONTENT_LENGTH}
                </span>
              )}
            </div>
            <motion.button
              whileHover={canSubmit ? { scale: 1.05 } : undefined}
              whileTap={canSubmit ? { scale: 0.95 } : undefined}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                canSubmit
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              }`}
            >
              <Send className="h-4 w-4" />
              投稿する
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
