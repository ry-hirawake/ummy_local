import type { NotificationEntity, CreateNotificationInput } from "@/types/entities";
import type { NotificationRepository } from "../types";

export class InMemoryNotificationRepository implements NotificationRepository {
  private notifications: Map<string, NotificationEntity> = new Map();
  private nextId = 1;

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async create(input: CreateNotificationInput): Promise<NotificationEntity> {
    const notification: NotificationEntity = {
      id: `notification-${this.nextId++}`,
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      referenceId: input.referenceId ?? null,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async markAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    this.notifications.set(id, { ...notification, isRead: true });
    return true;
  }

  async markAllAsRead(userId: string): Promise<number> {
    let count = 0;
    for (const [key, n] of this.notifications.entries()) {
      if (n.userId === userId && !n.isRead) {
        this.notifications.set(key, { ...n, isRead: true });
        count++;
      }
    }
    return count;
  }

  /** Direct insert with known id (for seeding). */
  seed(notification: NotificationEntity): void {
    this.notifications.set(notification.id, notification);
    const numId = parseInt(notification.id.replace("notification-", ""), 10);
    if (!isNaN(numId) && numId >= this.nextId) {
      this.nextId = numId + 1;
    }
  }
}
