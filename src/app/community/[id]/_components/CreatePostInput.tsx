/**
 * CreatePostInput - Presentational Component for post creation input
 * Props-only component (AC-1 compliance)
 */

"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Image as ImageIcon, Calendar } from "lucide-react";

interface CreatePostInputProps {
  communityName: string;
  currentUserAvatar: string;
}

export function CreatePostInput({
  communityName,
  currentUserAvatar,
}: CreatePostInputProps) {
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
          <input
            type="text"
            placeholder={`${communityName}で共有...`}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
          />
          <div className="mt-3 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted"
            >
              <ImageIcon className="h-4 w-4" />
              画像
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium transition-all hover:bg-muted"
            >
              <Calendar className="h-4 w-4" />
              イベント
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
