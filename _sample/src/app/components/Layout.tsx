import { Outlet, NavLink } from "react-router";
import { Home, MessageSquare, Users, BarChart3, Search, Bell, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function Layout() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navItems = [
    { to: "/", icon: Home, label: "フィード" },
    { to: "/messages", icon: MessageSquare, label: "メッセージ" },
    { to: "/people", icon: Users, label: "社員" },
    { to: "/analytics", icon: BarChart3, label: "分析" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-600">
                <span className="text-xl font-bold text-black">S</span>
              </div>
              <span className="text-xl font-semibold tracking-tight">Sync</span>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="relative w-full max-w-md"
              animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="検索..."
                className="w-full rounded-full border border-border bg-secondary px-12 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </motion.div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Plus className="mr-2 inline-block h-4 w-4" />
                投稿する
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative rounded-full bg-secondary p-2.5 transition-all hover:bg-muted"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-primary"
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
        className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r border-border/50 bg-sidebar/50 backdrop-blur-xl p-6"
      >
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
            >
              {({ isActive }) => (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className="relative z-10 h-5 w-5" />
                  <span className="relative z-10 font-medium">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Trending Topics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h3 className="mb-4 px-4 text-sm font-semibold text-muted-foreground">
            トレンド
          </h3>
          <div className="space-y-3">
            {["#新製品発表", "#チームビルディング", "#リモートワーク"].map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                whileHover={{ x: 4 }}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm transition-all hover:bg-sidebar-accent"
              >
                <div className="font-medium text-primary">{tag}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.floor(Math.random() * 50 + 10)}件の投稿
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-72 pt-16">
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
