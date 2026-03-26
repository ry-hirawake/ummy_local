import { Outlet, NavLink, Link } from "react-router";
import { Home, Search, Bell, Plus, Hash } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function Layout() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const communities = [
    { id: "1", name: "全社アナウンス", icon: "📢", members: 245 },
    { id: "2", name: "エンジニアリング", icon: "💻", members: 89 },
    { id: "3", name: "デザイン", icon: "🎨", members: 42 },
    { id: "4", name: "マーケティング", icon: "📊", members: 56 },
    { id: "5", name: "雑談", icon: "☕", members: 178 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-600">
                  <span className="text-xl font-bold text-black">V</span>
                </div>
                <span className="text-xl font-semibold tracking-tight">Viva Engage</span>
              </motion.div>
            </Link>

            {/* Search Bar */}
            <motion.div
              className="relative w-full max-w-lg"
              animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Viva Engageを検索"
                className="w-full rounded-lg border border-border bg-secondary px-12 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </motion.div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-lg bg-secondary p-2 transition-all hover:bg-muted"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border-2 border-primary/20"
              >
                <img
                  src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-border/50 bg-card/50 backdrop-blur-xl p-4"
      >
        <nav className="space-y-1">
          <NavLink to="/" end>
            {({ isActive }) => (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 h-full w-1 rounded-r-full bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Home className="relative z-10 h-5 w-5" />
                <span className="relative z-10 text-sm font-medium">ホーム</span>
              </motion.div>
            )}
          </NavLink>
        </nav>

        {/* Communities Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="mb-3 flex items-center justify-between px-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              コミュニティ
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </div>
          <div className="space-y-1">
            {communities.map((community, index) => (
              <Link key={community.id} to={`/community/${community.id}`}>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="cursor-pointer rounded-lg px-3 py-2 transition-all hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{community.icon}</span>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-sm font-medium">{community.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {community.members}人のメンバー
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Discover Communities */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition-all hover:border-primary hover:bg-background"
          >
            <Hash className="mr-2 inline-block h-4 w-4" />
            コミュニティを見つける
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}