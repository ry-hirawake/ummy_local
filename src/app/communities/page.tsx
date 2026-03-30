"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Hash, RefreshCw } from "lucide-react";
import { CommunityCard } from "@/components/community";

interface CommunityItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
}

export default function CommunitiesPage(): React.ReactElement {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchCommunities(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/communities");
      if (!res.ok) {
        throw new Error("コミュニティ一覧の取得に失敗しました");
      }
      const data: { communities: CommunityItem[] } = await res.json();
      setCommunities(data.communities);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "コミュニティ一覧の取得に失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchCommunities();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <Hash className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">コミュニティを見つける</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          興味のあるコミュニティに参加して、仲間とつながりましょう
        </p>
      </motion.div>

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="animate-pulse rounded-lg border border-border/50 bg-card p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
              <div className="mb-4 space-y-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-2/3 rounded bg-muted" />
              </div>
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center"
        >
          <p className="mb-4 text-sm text-destructive">{error}</p>
          <button
            onClick={() => void fetchCommunities()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            再試行
          </button>
        </motion.div>
      )}

      {!loading && !error && communities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-border/50 bg-card p-10 text-center"
        >
          <Hash className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            コミュニティがまだありません
          </p>
        </motion.div>
      )}

      {!loading && !error && communities.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {communities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <CommunityCard
                id={community.id}
                name={community.name}
                icon={community.icon}
                description={community.description}
                memberCount={community.memberCount}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
