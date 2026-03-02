import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

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
  image?: string;
  isLiked?: boolean;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "田中 美咲",
      role: "マーケティングマネージャー",
      avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content: "新しい製品ローンチキャンペーンが大成功を収めました！チーム全員の努力のおかげです。素晴らしい結果を達成できたことを誇りに思います 🎉",
    timestamp: "2時間前",
    likes: 42,
    comments: 8,
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "佐藤 健太",
      role: "シニアデベロッパー",
      avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content: "今日のテックトークセッションありがとうございました！新しいアーキテクチャについて多くの質問をいただき、とても有意義でした。資料はSlackで共有します。",
    timestamp: "4時間前",
    likes: 28,
    comments: 12,
    isLiked: true,
  },
  {
    id: "3",
    author: {
      name: "鈴木 愛",
      role: "プロダクトデザイナー",
      avatar: "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    content: "新しいUIデザインシステムのプロトタイプが完成しました。ユーザビリティテストの結果も上々です。皆さんのフィードバックをお待ちしています！#デザイン #UX",
    timestamp: "6時間前",
    likes: 56,
    comments: 15,
    isLiked: false,
  },
];

export function Feed() {
  const [posts, setPosts] = useState(mockPosts);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Create Post Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card p-6"
        >
          <div className="flex gap-4">
            <img
              src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Your avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="何を共有しますか？"
                className="w-full rounded-xl border border-border bg-secondary px-4 py-3 outline-none transition-all focus:border-primary/50 focus:bg-background"
              />
            </div>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex gap-4">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-full p-2 transition-all hover:bg-muted"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="leading-relaxed">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between border-t border-border/50 px-6 py-4">
                <div className="flex gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-all ${
                      post.isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={post.isLiked ? "currentColor" : "none"}
                    />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Share2 className="h-5 w-5" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground transition-all hover:text-primary"
                >
                  <Bookmark className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-8 py-3 font-medium transition-all hover:border-primary hover:bg-background"
          >
            <TrendingUp className="h-4 w-4" />
            さらに読み込む
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
