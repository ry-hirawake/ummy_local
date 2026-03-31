"use client";

import { MessageSquare, SmilePlus, BellRing } from "lucide-react";
import type { NotificationEntity } from "@/types/entities";

function formatRelativeTime(date: Date | string): string {
  const now = Date.now();
  const target = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  const diffMs = now - target;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "たった今";
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}時間前`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}日前`;
}

function typeIcon(type: string) {
  switch (type) {
    case "comment":
      return <MessageSquare className="h-4 w-4 text-blue-400" />;
    case "reaction":
      return <SmilePlus className="h-4 w-4 text-yellow-400" />;
    default:
      return <BellRing className="h-4 w-4 text-muted-foreground" />;
  }
}

interface NotificationPanelProps {
  notifications: NotificationEntity[];
  onNotificationClick: (notification: NotificationEntity) => void;
  onClose: () => void;
}

export function NotificationPanel({
  notifications,
  onNotificationClick,
  onClose,
}: NotificationPanelProps) {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card shadow-xl"
      role="dialog"
      aria-label="通知パネル"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">通知</h3>
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          閉じる
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            通知はまだありません
          </p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => onNotificationClick(n)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary ${
                !n.isRead ? "bg-primary/5" : ""
              }`}
              data-testid={`notification-${n.id}`}
            >
              <div className="mt-0.5 flex-shrink-0">{typeIcon(n.type)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{n.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatRelativeTime(n.createdAt)}
                </p>
              </div>
              {!n.isRead && (
                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
