/**
 * Mock data for Ummy home feed
 * Extracted from app/page.tsx for AC-1 compliance
 */

import type { Post } from "@/types/post";

export const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "田中 美咲",
      role: "マーケティングマネージャー",
      avatar:
        "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content:
      "新しい製品ローンチキャンペーンが大成功を収めました！チーム全員の努力のおかげです。素晴らしい結果を達成できたことを誇りに思います \n\n主な成果：\n✅ 目標の150%達成\n✅ 新規顧客獲得数が過去最高\n✅ SNSエンゲージメント300%増加\n\nみなさんの協力に感謝します！",
    timestamp: "2時間前",
    likes: 42,
    comments: 8,
    shares: 3,
    community: "📊 マーケティング",
    reactions: {
      thumbsUp: 25,
      partyPopper: 12,
      lightbulb: 3,
      laugh: 2,
    },
    commentList: [
      {
        id: "c1",
        author: {
          name: "佐藤 健太",
          avatar:
            "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        content: "素晴らしい成果ですね！おめでとうございます🎊",
        timestamp: "1時間前",
        likes: 5,
        replies: [
          {
            id: "c1-r1",
            author: {
              name: "田中 美咲",
              avatar:
                "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
            },
            content:
              "ありがとうございます！チーム全員の協力があってこその成果です😊",
            timestamp: "50分前",
            likes: 3,
          },
        ],
      },
      {
        id: "c2",
        author: {
          name: "鈴木 愛",
          avatar:
            "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        content:
          "SNSエンゲージメント300%増加は驚異的ですね！どの施策が最も効果的でしたか？",
        timestamp: "45分前",
        likes: 8,
        replies: [
          {
            id: "c2-r1",
            author: {
              name: "田中 美咲",
              avatar:
                "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
            },
            content:
              "インフルエンサーとのコラボレーションと、ユーザー生成コンテンツキャンペーンが特に効果的でした！詳細は来週の全体会議で共有します📊",
            timestamp: "30分前",
            likes: 6,
          },
          {
            id: "c2-r2",
            author: {
              name: "鈴木 愛",
              avatar:
                "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            content: "楽しみにしています！ありがとうございます✨",
            timestamp: "25分前",
            likes: 2,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "佐藤 健太",
      role: "シニアデベロッパー",
      avatar:
        "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content:
      "今日のテックトークセッション「新しいアーキテクチャパターン」にご参加いただきありがとうございました！\n\n多くの質問をいただき、とても有意義でした。セッション資料とコードサンプルはSlackの#engineeringチャンネルで共有します。\n\n次回は来週木曜日、GraphQL実装について話します！",
    timestamp: "4時間前",
    likes: 28,
    comments: 12,
    shares: 5,
    community: "💻 エンジニアリング",
    reactions: {
      thumbsUp: 18,
      partyPopper: 5,
      lightbulb: 8,
      laugh: 1,
    },
    userReaction: "lightbulb",
    commentList: [],
  },
  {
    id: "3",
    author: {
      name: "鈴木 愛",
      role: "プロダクトデザイナー",
      avatar:
        "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content:
      "新しいUIデザインシステムのプロトタイプが完成しました！ 🎨\n\nユーザビリティテストの結果も上々で、タスク完了時間が40%短縮されました。皆さんのフィードバックをお待ちしています。\n\nFigmaリンク: [デザインシステムv2.0]\n\n#デザイン #UX #プロトタイプ",
    timestamp: "6時間前",
    likes: 56,
    comments: 15,
    shares: 8,
    community: "🎨 デザイン",
    reactions: {
      thumbsUp: 30,
      partyPopper: 15,
      lightbulb: 9,
      laugh: 2,
    },
    commentList: [],
  },
];

/**
 * Current user avatar URL (placeholder for future auth integration)
 */
export const currentUserAvatar =
  "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080";
