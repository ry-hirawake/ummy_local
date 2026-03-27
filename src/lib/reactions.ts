/**
 * Reaction icon definitions for Ummy
 * Extracted from app/page.tsx for reusability
 */

import {
  ThumbsUp,
  Laugh,
  Lightbulb,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import type { ReactionType } from "@/types/post";

export interface ReactionConfig {
  icon: LucideIcon;
  label: string;
  color: string;
}

export const reactionIcons: Record<ReactionType, ReactionConfig> = {
  thumbsUp: { icon: ThumbsUp, label: "いいね", color: "text-blue-500" },
  partyPopper: { icon: PartyPopper, label: "祝福", color: "text-yellow-500" },
  lightbulb: { icon: Lightbulb, label: "ひらめき", color: "text-orange-500" },
  laugh: { icon: Laugh, label: "笑", color: "text-green-500" },
};
