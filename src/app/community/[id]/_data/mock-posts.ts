/**
 * Mock community posts data
 * Extracted from community/[id]/page.tsx for AC-1 compliance
 */

import type { CommunityPost } from "./types";

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: "1",
    author: {
      name: "田中 美咲",
      role: "マーケティングマネージャー",
      avatar:
        "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content:
      "次回のオールハンズミーティングは来週金曜日14:00からです。全員参加必須です。\n\nアジェンダ：\n• Q4の業績レビュー\n• 新製品発表\n• チーム再編成のお知らせ\n\nZoomリンクは後ほど共有します。",
    timestamp: "1時間前",
    likes: 42,
    comments: 8,
    shares: 3,
    reactions: {
      thumbsUp: 35,
      partyPopper: 5,
      lightbulb: 2,
      laugh: 0,
    },
    isPinned: true,
    commentList: [
      {
        id: "c1",
        author: {
          name: "山田 太郎",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        content: "Zoomリンクはいつ頃共有される予定でしょうか？カレンダーに登録しておきたいです。",
        timestamp: "45分前",
        likes: 3,
        replies: [
          {
            id: "c1-r1",
            author: {
              name: "田中 美咲",
              avatar:
                "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
            },
            content:
              "今週水曜日までには共有します！カレンダー招待も一緒に送りますので、そちらにリンクが記載されます✨",
            timestamp: "30分前",
            likes: 2,
          },
        ],
      },
      {
        id: "c2",
        author: {
          name: "佐々木 花子",
          avatar:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        content: "新製品発表、楽しみです！何かサプライズがあるのでしょうか？👀",
        timestamp: "40分前",
        likes: 5,
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
      "新しいデプロイメントパイプラインが稼働開始しました！🚀\n\nビルド時間が50%短縮され、自動テストも大幅に改善されています。詳細はConfluenceのドキュメントをご確認ください。",
    timestamp: "3時間前",
    likes: 28,
    comments: 12,
    shares: 5,
    reactions: {
      thumbsUp: 22,
      partyPopper: 8,
      lightbulb: 5,
      laugh: 1,
    },
    userReaction: "lightbulb",
    commentList: [
      {
        id: "c3",
        author: {
          name: "高橋 誠",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        content: "素晴らしい改善ですね！これで開発効率が大幅に上がりそうです💪",
        timestamp: "2時間前",
        likes: 4,
        replies: [
          {
            id: "c3-r1",
            author: {
              name: "佐藤 健太",
              avatar:
                "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
            },
            content:
              "はい！早速チームメンバーからもポジティブなフィードバックをもらっています。次のスプリントではさらに最適化を進める予定です🚀",
            timestamp: "1時間前",
            likes: 3,
          },
        ],
      },
    ],
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
      "チームランチのお誘いです！🍱\n\n明日12:30から新しくオープンしたイタリアンレストランに行きます。参加希望の方はこの投稿にリアクションをお願いします！",
    timestamp: "5時間前",
    likes: 45,
    comments: 18,
    shares: 2,
    reactions: {
      thumbsUp: 25,
      partyPopper: 12,
      lightbulb: 1,
      laugh: 7,
    },
    commentList: [],
  },
];

export const currentUserAvatar =
  "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080";
