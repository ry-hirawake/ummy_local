import { TrendingUp, Users, MessageSquare, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const engagementData = [
  { date: "2/24", posts: 45, likes: 320, comments: 89 },
  { date: "2/25", posts: 52, likes: 410, comments: 112 },
  { date: "2/26", posts: 48, likes: 385, comments: 95 },
  { date: "2/27", posts: 61, likes: 475, comments: 128 },
  { date: "2/28", posts: 55, likes: 430, comments: 106 },
  { date: "3/1", posts: 70, likes: 550, comments: 145 },
  { date: "3/2", posts: 78, likes: 620, comments: 167 },
];

const departmentData = [
  { name: "エンジニアリング", engagement: 85 },
  { name: "デザイン", engagement: 72 },
  { name: "マーケティング", engagement: 68 },
  { name: "営業", engagement: 55 },
  { name: "人事", engagement: 45 },
];

const stats = [
  {
    title: "総投稿数",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "アクティブユーザー",
    value: "856",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-purple-500",
  },
  {
    title: "総エンゲージメント",
    value: "5,432",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
    color: "from-green-500 to-teal-500",
  },
  {
    title: "閲覧数",
    value: "12,345",
    change: "-2.1%",
    trend: "down",
    icon: Eye,
    color: "from-pink-500 to-rose-500",
  },
];

export function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold">分析ダッシュボード</h1>
          <p className="text-muted-foreground">社内コミュニケーションの詳細な分析</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:border-border hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="mb-1 text-sm text-muted-foreground">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Engagement Trend */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">エンゲージメント推移</h2>
              <p className="text-sm text-muted-foreground">過去7日間のアクティビティ</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  stroke="#ff6b35"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorLikes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Department Engagement */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">部署別エンゲージメント</h2>
              <p className="text-sm text-muted-foreground">アクティビティスコア</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="engagement" fill="#ff6b35" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Posts Over Time */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">投稿数の推移</h2>
              <p className="text-sm text-muted-foreground">日別の投稿アクティビティ</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="#ff6b35"
                  strokeWidth={3}
                  dot={{ fill: "#ff6b35", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Comments Over Time */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold">コメント数の推移</h2>
              <p className="text-sm text-muted-foreground">日別のコメントアクティビティ</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="#ffa500"
                  strokeWidth={3}
                  dot={{ fill: "#ffa500", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Top Contributors */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 overflow-hidden rounded-2xl border border-border/50 bg-card p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold">トップコントリビューター</h2>
            <p className="text-sm text-muted-foreground">最もアクティブなメンバー</p>
          </div>
          <div className="space-y-4">
            {[
              { name: "田中 美咲", posts: 87, avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080" },
              { name: "佐藤 健太", posts: 72, avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080" },
              { name: "鈴木 愛", posts: 65, avatar: "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080" },
            ].map((contributor, index) => (
              <motion.div
                key={contributor.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary p-4 transition-all hover:border-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    #{index + 1}
                  </div>
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <h3 className="font-semibold">{contributor.name}</h3>
                    <p className="text-sm text-muted-foreground">{contributor.posts}件の投稿</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-orange-600"
                      style={{ width: `${(contributor.posts / 87) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
