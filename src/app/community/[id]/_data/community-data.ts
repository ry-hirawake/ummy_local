/**
 * Community information data
 * Extracted from community/[id]/page.tsx for AC-1 compliance
 */

import type { CommunityInfo } from "./types";

export const communityData: Record<string, CommunityInfo> = {
  "1": {
    name: "全社アナウンス",
    icon: "📢",
    members: 245,
    description: "会社からの重要なお知らせや全社に関わる情報を共有するコミュニティです",
  },
  "2": {
    name: "エンジニアリング",
    icon: "💻",
    members: 89,
    description: "技術的な議論、コードレビュー、新しい技術の共有を行うエンジニアのためのコミュニティ",
  },
  "3": {
    name: "デザイン",
    icon: "🎨",
    members: 42,
    description: "デザインのアイデア、フィードバック、トレンドを共有するクリエイティブなスペース",
  },
  "4": {
    name: "マーケティング",
    icon: "📊",
    members: 56,
    description: "マーケティング戦略、キャンペーン結果、市場分析を共有するコミュニティ",
  },
  "5": {
    name: "雑談",
    icon: "☕",
    members: 178,
    description: "リラックスした雰囲気で自由に会話を楽しむカジュアルなコミュニティ",
  },
};

export function getCommunityById(id: string): CommunityInfo | undefined {
  return communityData[id];
}
