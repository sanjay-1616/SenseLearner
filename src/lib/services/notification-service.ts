// ============================================================
// SenseLearn — Notification Service
// ============================================================

import { db } from '../data/store';
import type { Notification, NotificationType } from '../data/models';
import { generateId } from '../utils';

export const notificationService = {
  /**
   * Get all notifications for a user
   */
  getUserNotifications(userId: string): Notification[] {
    return db.notifications.findByUser(userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Get unread notification count
   */
  getUnreadCount(userId: string): number {
    return db.notifications.findUnreadByUser(userId).length;
  },

  /**
   * Mark single notification as read
   */
  markAsRead(notificationId: string): void {
    db.notifications.update(notificationId, { isRead: true });
  },

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): void {
    db.notifications.markAllRead(userId);
  },

  /**
   * Dispatch a new notification
   */
  sendNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
  }): Notification {
    const notification: Notification = {
      id: `notif-${generateId()}`,
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      isRead: false,
      actionUrl: params.actionUrl,
      createdAt: new Date().toISOString(),
    };

    db.notifications.create(notification);
    return notification;
  },
};
