"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Home as HomeIcon,
  Search,
  Plus,
  Hash,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { NotificationBell } from "@/components/notification";

const communities = [
  { id: "1", name: "全社アナウンス", icon: "📢", members: 245 },
  { id: "2", name: "エンジニアリング", icon: "💻", members: 89 },
  { id: "3", name: "デザイン", icon: "🎨", members: 42 },
  { id: "4", name: "マーケティング", icon: "📊", members: 56 },
  { id: "5", name: "雑談", icon: "☕", members: 178 },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  async function handleLogout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const isHome = pathname === "/";
  const currentCommunityId = pathname.startsWith("/community/")
    ? pathname.split("/")[2]
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-600">
                  <span className="text-xl font-bold text-black">U</span>
                </div>
                <span className="text-xl font-semibold tracking-tight">
                  Ummy
                </span>
              </motion.div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
              <motion.div
                className="relative"
                animate={{ scale: isSearchFocused ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ummyを検索"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-12 py-2.5 text-sm outline-none transition-all focus:border-primary/50 focus:bg-background"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </motion.div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <NotificationBell />

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border-2 border-primary/20"
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="rounded-lg bg-secondary p-2 transition-all hover:bg-muted"
                title="ログアウト"
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-border/50 bg-card/50 p-4 backdrop-blur-xl"
      >
        <nav className="space-y-1">
          <Link href="/">
            <motion.div
              whileHover={{ x: 4 }}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                isHome
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {isHome && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 h-full w-1 rounded-r-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <HomeIcon className="relative z-10 h-5 w-5" />
              <span className="relative z-10 text-sm font-medium">ホーム</span>
            </motion.div>
          </Link>
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
            <Link href="/communities">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Plus className="h-4 w-4" />
              </motion.div>
            </Link>
          </div>
          <div className="space-y-1">
            {communities.map((community, index) => (
              <Link key={community.id} href={`/community/${community.id}`}>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className={`cursor-pointer rounded-lg px-3 py-2 transition-all hover:bg-secondary ${
                    currentCommunityId === community.id
                      ? "bg-primary/10 text-primary"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{community.icon}</span>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate text-sm font-medium">
                        {community.name}
                      </div>
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
          <Link href="/communities">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-all ${
                pathname === "/communities"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary hover:border-primary hover:bg-background"
              }`}
            >
              <Hash className="mr-2 inline-block h-4 w-4" />
              コミュニティを見つける
            </motion.div>
          </Link>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="ml-64 pt-16">
        {children}
      </main>
    </div>
  );
}
