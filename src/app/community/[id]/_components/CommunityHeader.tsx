/**
 * CommunityHeader - Presentational Component for community header section
 * Props-only, no internal state except UI interactions (AC-1 compliance)
 */

"use client";

import { motion } from "motion/react";
import { Bell, Settings } from "lucide-react";
import type { CommunityInfo } from "../_data";

interface CommunityHeaderProps {
  community: CommunityInfo;
  isJoined: boolean;
  onJoinToggle: () => void;
}

export function CommunityHeader({
  community,
  isJoined,
  onJoinToggle,
}: CommunityHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border/50 bg-card"
    >
      {/* Cover Section */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-r from-primary/20 to-orange-500/20">
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 mx-auto max-w-4xl px-6">
          <div className="flex items-end gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-orange-600 text-4xl shadow-xl">
              {community.icon}
            </div>
            <div className="mb-2 flex-1">
              <h1 className="text-2xl font-bold">{community.name}</h1>
              <p className="text-sm text-muted-foreground">
                {community.members}人のメンバー
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <p className="flex-1 text-sm text-muted-foreground">
            {community.description}
          </p>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onJoinToggle}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                isJoined
                  ? "border border-border bg-secondary text-foreground hover:bg-muted"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isJoined ? "参加中" : "参加する"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border border-border bg-secondary p-2 transition-all hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border border-border bg-secondary p-2 transition-all hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex gap-6 border-b border-border/50">
          <button className="border-b-2 border-primary pb-2 text-sm font-semibold text-primary">
            投稿
          </button>
          <button className="pb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            メンバー
          </button>
          <button className="pb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            ファイル
          </button>
          <button className="pb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            イベント
          </button>
        </div>
      </div>
    </motion.div>
  );
}
