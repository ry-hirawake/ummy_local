/**
 * CommunityCard - Presentational Component for displaying a community in the directory.
 * Props-only, no internal state. (Story-0006: AC-1, AC-2)
 */

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Users } from "lucide-react";

interface CommunityCardProps {
  id: string;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
}

export function CommunityCard({
  id,
  name,
  icon,
  description,
  memberCount,
}: CommunityCardProps): React.ReactElement {
  return (
    <Link href={`/community/${id}`}>
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="cursor-pointer rounded-lg border border-border/50 bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
      >
        <div className="mb-3 flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-base font-semibold leading-tight">{name}</h3>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{memberCount}人のメンバー</span>
        </div>
      </motion.div>
    </Link>
  );
}
