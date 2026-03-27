/**
 * Community-specific type definitions
 * Extracted from community/[id]/page.tsx for AC-1 compliance
 */

import type { Comment } from "@/types/post";

export interface CommunityInfo {
  name: string;
  icon: string;
  members: number;
  description: string;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  reactions: {
    thumbsUp: number;
    partyPopper: number;
    lightbulb: number;
    laugh: number;
  };
  userReaction?: string;
  isPinned?: boolean;
  commentList?: Comment[];
}

export type CommunityReactionType = keyof CommunityPost["reactions"];
