import { Search, Mail, MessageSquare, UserPlus, Filter } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Person {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: "online" | "offline" | "away";
  skills: string[];
}

const mockPeople: Person[] = [
  {
    id: "1",
    name: "田中 美咲",
    role: "マーケティングマネージャー",
    department: "マーケティング部",
    avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "online",
    skills: ["戦略", "ブランディング", "分析"],
  },
  {
    id: "2",
    name: "佐藤 健太",
    role: "シニアデベロッパー",
    department: "エンジニアリング部",
    avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "online",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: "3",
    name: "鈴木 愛",
    role: "プロダクトデザイナー",
    department: "デザイン部",
    avatar: "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "away",
    skills: ["UI/UX", "Figma", "プロトタイピング"],
  },
  {
    id: "4",
    name: "高橋 翔",
    role: "プロジェクトマネージャー",
    department: "プロジェクト管理部",
    avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "offline",
    skills: ["アジャイル", "リーダーシップ", "計画"],
  },
  {
    id: "5",
    name: "山田 結衣",
    role: "データアナリスト",
    department: "データサイエンス部",
    avatar: "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "online",
    skills: ["Python", "SQL", "機械学習"],
  },
  {
    id: "6",
    name: "中村 大輔",
    role: "セールスマネージャー",
    department: "営業部",
    avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    status: "online",
    skills: ["営業戦略", "顧客対応", "交渉"],
  },
];

export function People() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeople = mockPeople.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold">社員ディレクトリ</h1>
          <p className="text-muted-foreground">チームメンバーを探して繋がりましょう</p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="名前、役職、部署で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary py-3 pl-12 pr-4 outline-none transition-all focus:border-primary/50 focus:bg-background"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 transition-all hover:border-primary hover:bg-background"
          >
            <Filter className="h-5 w-5" />
            フィルター
          </motion.button>
        </motion.div>

        {/* People Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Card Header */}
              <div className="relative h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="h-24 w-24 rounded-2xl border-4 border-card object-cover shadow-xl"
                    />
                    <span
                      className={`absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-card ${
                        person.status === "online"
                          ? "bg-green-500"
                          : person.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="px-6 pb-6 pt-16">
                <h3 className="mb-1 text-xl font-bold">{person.name}</h3>
                <p className="mb-1 text-sm text-muted-foreground">{person.role}</p>
                <p className="mb-4 text-xs text-muted-foreground">{person.department}</p>

                {/* Skills */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {person.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    <MessageSquare className="h-4 w-4" />
                    メッセージ
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center rounded-xl border border-border bg-secondary p-2.5 transition-all hover:border-primary hover:bg-background"
                  >
                    <Mail className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center rounded-xl border border-border bg-secondary p-2.5 transition-all hover:border-primary hover:bg-background"
                  >
                    <UserPlus className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
