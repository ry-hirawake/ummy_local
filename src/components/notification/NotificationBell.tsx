"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Bell } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import type { NotificationEntity } from "@/types/entities";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch unread count on mount
  useEffect(() => {
    fetch("/api/notifications?countOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => {});
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBellClick = () => {
    const opening = !panelOpen;
    setPanelOpen(opening);
    if (opening) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = async (notification: NotificationEntity) => {
    setPanelOpen(false);

    // 1. Resolve the target post's community before marking as read
    if (notification.referenceId) {
      try {
        const res = await fetch(`/api/posts/${notification.referenceId}`);
        const data = await res.json();
        if (data.post?.communityId) {
          // 2. Navigate to the specific post
          router.push(
            `/community/${data.post.communityId}#post-${notification.referenceId}`
          );

          // 3. Mark as read only after successful navigation resolution
          await fetch("/api/notifications/read", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationId: notification.id }),
          });

          // 4. Update local state
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
          setUnreadCount((prev) =>
            notification.isRead ? prev : Math.max(0, prev - 1)
          );
          return;
        }
      } catch {
        // Navigation failed — do not mark as read
      }
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBellClick}
        className="relative rounded-lg bg-secondary p-2 transition-all hover:bg-muted"
        aria-label="通知"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground"
            data-testid="notification-badge"
          >
            {unreadCount}
          </span>
        )}
      </motion.button>
      {panelOpen && (
        <NotificationPanel
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onClose={() => setPanelOpen(false)}
        />
      )}
    </div>
  );
}
