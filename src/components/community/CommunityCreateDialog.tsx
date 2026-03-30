"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface CommunityCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; icon: string; description: string }) => void;
  submitting: boolean;
  error: string | null;
}

export function CommunityCreateDialog({
  open,
  onClose,
  onSubmit,
  submitting,
  error,
}: CommunityCreateDialogProps): React.ReactElement | null {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    onSubmit({ name, icon, description });
  }

  const canSubmit = name.trim().length > 0 && !submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div
        role="dialog"
        aria-label="コミュニティを作成"
        className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">コミュニティを作成</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="community-name" className="mb-1.5 block text-sm font-medium">
              コミュニティ名 <span className="text-destructive">*</span>
            </label>
            <input
              id="community-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: プロジェクトA"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="community-icon" className="mb-1.5 block text-sm font-medium">
              アイコン
            </label>
            <input
              id="community-icon"
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="例: 🚀"
              className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background"
            />
          </div>

          <div>
            <label htmlFor="community-description" className="mb-1.5 block text-sm font-medium">
              説明
            </label>
            <textarea
              id="community-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="コミュニティの説明を入力してください"
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-secondary px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-background"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
