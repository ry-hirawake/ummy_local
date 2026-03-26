"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
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

interface Post {
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

const mockPosts: Post[] = [
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
          <button className="transition-colors hover:text-primary">
            いいね
          </button>
          <button
            className="transition-colors hover:text-primary"
            onClick={() =>
              setReplyingTo(replyingTo === comment.id ? null : comment.id)
            }
          >
            返信
          </button>
          <span>{comment.timestamp}</span>
          {comment.likes > 0 && <span>👍 {comment.likes}</span>}
        </div>

        {/* Reply Input */}
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

        {/* Nested Replies */}
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

export default function Home() {
  const [posts, setPosts] = useState(mockPosts);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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
      {/* Feed */}
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-6 py-6">
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
                {/* Post Header */}
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
                      <h3 className="text-sm font-semibold">
                        {post.author.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {post.author.role}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.timestamp}</span>
                        {post.community && (
                          <>
                            <span>•</span>
                            <span className="text-primary">
                              {post.community}
                            </span>
                          </>
                        )}
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

                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Reactions Summary */}
                {Object.values(post.reactions).some(
                  (count) => count > 0
                ) && (
                  <div className="border-t border-border/50 px-4 py-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <div className="flex -space-x-1">
                        {Object.entries(post.reactions).map(
                          ([type, count]) => {
                            if (count > 0) {
                              const ReactionIcon =
                                reactionIcons[
                                  type as keyof typeof reactionIcons
                                ].icon;
                              return (
                                <div
                                  key={type}
                                  className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary ring-2 ring-card"
                                >
                                  <ReactionIcon
                                    className={`h-3 w-3 ${
                                      reactionIcons[
                                        type as keyof typeof reactionIcons
                                      ].color
                                    }`}
                                  />
                                </div>
                              );
                            }
                            return null;
                          }
                        )}
                      </div>
                      <span className="ml-1">
                        {Object.values(post.reactions).reduce(
                          (a, b) => a + b,
                          0
                        )}
                      </span>
                      <span className="ml-auto">
                        {post.comments}件のコメント • {post.shares}回共有
                      </span>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-1 border-t border-border/50 p-2">
                  <div className="relative flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setShowReactions(
                          showReactions === post.id ? null : post.id
                        )
                      }
                      className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-secondary ${
                        post.userReaction
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {post.userReaction ? (
                        <>
                          {(() => {
                            const ReactionIcon =
                              reactionIcons[
                                post.userReaction as keyof typeof reactionIcons
                              ].icon;
                            return <ReactionIcon className="h-4 w-4" />;
                          })()}
                          <span className="font-medium">
                            {
                              reactionIcons[
                                post.userReaction as keyof typeof reactionIcons
                              ].label
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

                    {/* Reactions Popup */}
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
                                  onClick={() =>
                                    handleReaction(post.id, type)
                                  }
                                  className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all hover:bg-secondary ${
                                    post.userReaction === type
                                      ? "bg-secondary"
                                      : ""
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

                {/* Comments Section */}
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

                        {/* Add Comment */}
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

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium shadow-sm transition-all hover:bg-secondary"
            >
              さらに読み込む
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
