/**
 * Post and Comment type definitions for Ummy home feed
 * Extracted from app/page.tsx for AC-1 compliance
 */

export interface Comment {
  id: string;
  author: {
    name: string;
    role?: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
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
  image?: string;
  reactions: {
    thumbsUp: number;
    partyPopper: number;
    lightbulb: number;
    laugh: number;
  };
  userReaction?: string;
  community?: string;
  commentList?: Comment[];
}

export type ReactionType = keyof Post["reactions"];
