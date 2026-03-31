import type {
  NotificationEntity,
  CreateNotificationInput,
} from "@/types/entities";
import type { Repositories } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { ok, fail } from "./types";

export class NotificationService {
  constructor(private repos: Repositories) {}

  async getByUserId(
    userId: string
  ): Promise<ServiceResult<NotificationEntity[]>> {
    const notifications = await this.repos.notifications.findByUserId(userId);
    return ok(notifications);
  }

  async countUnread(userId: string): Promise<ServiceResult<number>> {
    const count = await this.repos.notifications.countUnreadByUserId(userId);
    return ok(count);
  }

  async create(
    input: CreateNotificationInput
  ): Promise<ServiceResult<NotificationEntity>> {
    const notification = await this.repos.notifications.create(input);
    return ok(notification);
  }

  async markAsRead(notificationId: string): Promise<ServiceResult<void>> {
    const success = await this.repos.notifications.markAsRead(notificationId);
    if (!success) return fail("NOT_FOUND", "通知が見つかりません");
    return ok(undefined);
  }

  async markAllAsRead(userId: string): Promise<ServiceResult<number>> {
    const count = await this.repos.notifications.markAllAsRead(userId);
    return ok(count);
  }
}
