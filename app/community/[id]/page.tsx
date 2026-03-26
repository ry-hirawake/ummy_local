"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell,
  Settings,
  Pin,
  Calendar,
  Image as ImageIcon,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Laugh,
  Lightbulb,
  PartyPopper,
  Send,
} from "lucide-react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommunityPost {
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

const communityData: Record<string, { name: string; icon: string; members: number; description: string }> = {
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

const mockCommunityPosts: CommunityPost[] = [
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

const reactionIcons = {
  thumbsUp: { icon: ThumbsUp, label: "いいね", color: "text-blue-500" },
  partyPopper: { icon: PartyPopper, label: "祝福", color: "text-yellow-500" },
  lightbulb: { icon: Lightbulb, label: "ひらめき", color: "text-orange-500" },
  laugh: { icon: Laugh, label: "笑", color: "text-green-500" },
};

function CommentItem({
  comment,
  isReply = false,
  replyingTo,
  setReplyingTo,
}: {
  comment: Comment;
  isReply?: boolean;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isReply ? "ml-12 mt-3" : ""}`}
    >
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="rounded-lg bg-secondary px-3 py-2">
          <h4 className="text-sm font-semibold">{comment.author.name}</h4>
          <p className="mt-1 text-sm">{comment.content}</p>
        </div>
        <div className="mt-1 flex items-center gap-4 px-3 text-xs text-muted-foreground">
          <button className="transition-colors hover:text-primary">いいね</button>
          <button
            className="transition-colors hover:text-primary"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            返信
          </button>
          <span>{comment.timestamp}</span>
          {comment.likes > 0 && <span>👍 {comment.likes}</span>}
        </div>

        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex gap-2"
            >
              <img
                src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Your avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  placeholder="返信を入力..."
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all focus:border-primary/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg bg-primary p-2 text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply={true}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CommunityPage() {
  const params = useParams();
  const id = params.id as string;

  const [posts, setPosts] = useState(mockCommunityPosts);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(true);

  const community = communityData[id] || communityData["1"];

  const handleReaction = (postId: string, reactionType: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };

          if (post.userReaction) {
            newReactions[post.userReaction as keyof typeof post.reactions]--;
          }

          if (post.userReaction !== reactionType) {
            newReactions[reactionType as keyof typeof post.reactions]++;
            return { ...post, reactions: newReactions, userReaction: reactionType };
          }

          return { ...post, reactions: newReactions, userReaction: undefined };
        }
        return post;
      })
    );
    setShowReactions(null);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Community Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border/50 bg-card"
      >
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

        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <p className="flex-1 text-sm text-muted-foreground">
              {community.description}
            </p>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsJoined(!isJoined)}
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

      {/* Community Content */}
      <div className="mx-auto max-w-4xl px-6 py-6">
        {/* Create Post */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 overflow-hidden rounded-lg border border-border/50 bg-card p-4 shadow-sm"
        >
          <div className="flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Your avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder={`${community.name}で共有...`}
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

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm transition-all hover:shadow-md"
            >
              {post.isPinned && (
                <div className="flex items-center gap-2 border-b border-border/50 bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                  <Pin className="h-3.5 w-3.5" />
                  ピン留めされた投稿
                </div>
              )}

              <div className="flex items-start justify-between p-4 pb-3">
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-semibold">{post.author.name}</h3>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-full p-1.5 transition-all hover:bg-muted"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="px-4 pb-3">
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {post.content}
                </p>
              </div>

              {Object.values(post.reactions).some((count) => count > 0) && (
                <div className="border-t border-border/50 px-4 py-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="flex -space-x-1">
                      {Object.entries(post.reactions).map(([type, count]) => {
                        if (count > 0) {
                          const ReactionIcon =
                            reactionIcons[type as keyof typeof reactionIcons].icon;
                          return (
                            <div
                              key={type}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary ring-2 ring-card"
                            >
                              <ReactionIcon
                                className={`h-3 w-3 ${
                                  reactionIcons[type as keyof typeof reactionIcons].color
                                }`}
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <span className="ml-1">
                      {Object.values(post.reactions).reduce((a, b) => a + b, 0)}
                    </span>
                    <span className="ml-auto">
                      {post.comments}件のコメント • {post.shares}回共有
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 border-t border-border/50 p-2">
                <div className="relative flex-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setShowReactions(showReactions === post.id ? null : post.id)
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-secondary ${
                      post.userReaction ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {post.userReaction ? (
                      <>
                        {(() => {
                          const ReactionIcon =
                            reactionIcons[post.userReaction as keyof typeof reactionIcons]
                              .icon;
                          return <ReactionIcon className="h-4 w-4" />;
                        })()}
                        <span className="font-medium">
                          {
                            reactionIcons[post.userReaction as keyof typeof reactionIcons]
                              .label
                          }
                        </span>
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="h-4 w-4" />
                        <span className="font-medium">リアクション</span>
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {showReactions === post.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl border border-border bg-card p-2 shadow-xl"
                      >
                        <div className="flex gap-1">
                          {Object.entries(reactionIcons).map(
                            ([type, { icon: Icon, label, color }]) => (
                              <motion.button
                                key={type}
                                whileHover={{ scale: 1.2, y: -4 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleReaction(post.id, type)}
                                className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all hover:bg-secondary ${
                                  post.userReaction === type ? "bg-secondary" : ""
                                }`}
                                title={label}
                              >
                                <Icon className={`h-6 w-6 ${color}`} />
                              </motion.button>
                            )
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleComments(post.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">コメント</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="font-medium">共有</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-secondary"
                >
                  <Bookmark className="h-4 w-4" />
                </motion.button>
              </div>

              <AnimatePresence>
                {expandedComments === post.id &&
                  post.commentList &&
                  post.commentList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border/50 bg-muted/30 p-4"
                    >
                      <div className="space-y-4">
                        {post.commentList.map((comment) => (
                          <CommentItem
                            key={comment.id}
                            comment={comment}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                          />
                        ))}
                      </div>

                      <div className="mt-4 flex gap-3 border-t border-border/50 pt-4">
                        <img
                          src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Your avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="flex flex-1 gap-2">
                          <input
                            type="text"
                            placeholder="コメントを追加..."
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-all focus:border-primary/50"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="rounded-lg bg-primary p-2 text-primary-foreground transition-all hover:bg-primary/90"
                          >
                            <Send className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
