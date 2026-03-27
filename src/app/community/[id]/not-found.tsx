/**
 * Not Found page for community routes
 * Displayed when notFound() is called (AC-4 compliance)
 */

import Link from "next/link";

export default function CommunityNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-6xl">🔍</div>
      <h1 className="mb-2 text-2xl font-bold">コミュニティが見つかりません</h1>
      <p className="mb-6 text-muted-foreground">
        お探しのコミュニティは存在しないか、削除された可能性があります。
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
