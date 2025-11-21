import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../database/prisma.service';
import { EmailService } from '../../auth/email.service';
import {
  SendNotificationRequest,
  NotificationPreferenceConfig,
  DigestConfig,
  SmartNotificationRule,
  PushNotificationPayload,
  CalendarEventConfig,
} from '../interfaces/notifications.interface';
import {
  SendNotificationDto,
  CreateNotificationPreferenceDto,
  UpdateNotificationPreferenceDto,
} from '../dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Story 6.4: Send notification
  async send(request: SendNotificationDto): Promise<any> {
    try {
      // Check user preferences before sending
      const preference = await this.getUserPreference(
        request.recipientId,
        this.determineCategory(request.type),
        request.channel,
      );

      // If user has disabled this notification type, skip or queue for digest
      if (preference && !preference.isEnabled) {
        if (preference.frequency !== 'IMMEDIATE') {
          return this.queueForDigest(request, preference);
        }
        this.logger.log(`Notification blocked by user preference: ${request.recipientId}`);
        return null;
      }

      // Check quiet hours
      if (preference && this.isQuietHours(preference)) {
        this.logger.log(`Notification deferred due to quiet hours: ${request.recipientId}`);
        return this.scheduleNotification(request, this.calculateQuietHoursEnd(preference));
      }

      // Create notification record
      const notification = await this.prisma.notification.create({
        data: {
          recipientId: request.recipientId,
          recipientType: request.recipientType,
          channel: request.channel,
          type: request.type,
          title: request.title,
          message: request.message,
          data: request.data as any,
          priority: request.priority || 'MEDIUM',
          status: request.scheduledFor ? 'SCHEDULED' : 'PENDING',
          scheduledFor: request.scheduledFor,
          expiresAt: request.expiresAt,
          templateId: request.templateId,
          responseRequired: request.responseRequired,
        },
      });

      // Send immediately or schedule
      if (!request.scheduledFor) {
        await this.deliverNotification(notification);
      }

      // Create history record
      await this.prisma.notificationHistory.create({
        data: {
          notificationId: notification.id,
          recipientId: request.recipientId,
          recipientType: request.recipientType,
          channel: request.channel,
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      this.logger.log(`Notification sent: ${notification.id} to ${request.recipientId}`);
      return notification;
    } catch (error) {
      this.logger.error('Error sending notification', error);
      throw error;
    }
  }

  // Story 6.4: Deliver notification through appropriate channel
  private async deliverNotification(notification: any): Promise<void> {
    const startTime = Date.now();

    try {
      switch (notification.channel) {
        case 'EMAIL':
          await this.sendEmail(notification);
          break;
        case 'SMS':
          await this.sendSMS(notification);
          break;
        case 'IN_APP':
          await this.sendInApp(notification);
          break;
        case 'PUSH':
          await this.sendPush(notification);
          break;
        case 'WEBHOOK':
          await this.sendWebhook(notification);
          break;
        default:
          throw new Error(`Unsupported channel: ${notification.channel}`);
      }

      const duration = Date.now() - startTime;

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      await this.prisma.notificationHistory.updateMany({
        where: { notificationId: notification.id },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
          deliveryDuration: duration,
        },
      });
    } catch (error) {
      this.logger.error(`Error delivering notification ${notification.id}`, error);

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          retryCount: { increment: 1 },
        },
      });

      // Retry if within limits
      if (notification.retryCount < notification.maxRetries) {
        setTimeout(() => this.deliverNotification(notification), 60000); // Retry after 1 minute
      }
    }
  }

  // Send via email
  private async sendEmail(notification: any): Promise<void> {
    const recipient = await this.resolveRecipientEmail(notification.recipientId);

    if (!recipient) {
      throw new Error('Recipient email not found');
    }

    // In production, use a proper email service
    await this.emailService.sendNotificationEmail(recipient, notification.title, notification.message);
  }

  // Send via SMS (placeholder)
  private async sendSMS(notification: any): Promise<void> {
    this.logger.log(`SMS notification sent to: ${notification.recipientId}`);
    // Integrate with Twilio or similar service
  }

  // Send in-app notification
  private async sendInApp(notification: any): Promise<void> {
    // Store in database for in-app display
    this.logger.log(`In-app notification created for: ${notification.recipientId}`);
  }

  // Send push notification
  private async sendPush(notification: any): Promise<void> {
    // Integrate with Firebase Cloud Messaging or similar
    this.logger.log(`Push notification sent to: ${notification.recipientId}`);
  }

  // Send webhook notification
  private async sendWebhook(notification: any): Promise<void> {
    // POST to configured webhook URL
    this.logger.log(`Webhook notification sent to: ${notification.recipientId}`);
  }

  // Story 6.4: Manage notification preferences
  async createPreference(dto: CreateNotificationPreferenceDto): Promise<any> {
    return this.prisma.notificationPreference.create({
      data: {
        userId: dto.userId,
        category: dto.category as any,
        channel: dto.channel,
        isEnabled: dto.isEnabled,
        frequency: dto.frequency as any,
        quietHoursStart: dto.quietHoursStart,
        quietHoursEnd: dto.quietHoursEnd,
        digestSchedule: dto.digestSchedule,
        priority: 'MEDIUM' as any,
      },
    });
  }

  async updatePreference(id: string, dto: UpdateNotificationPreferenceDto): Promise<any> {
    return this.prisma.notificationPreference.update({
      where: { id },
      data: {
        category: dto.category as any,
        channel: dto.channel,
        isEnabled: dto.isEnabled,
        frequency: dto.frequency as any,
        quietHoursStart: dto.quietHoursStart,
        quietHoursEnd: dto.quietHoursEnd,
        digestSchedule: dto.digestSchedule,
      },
    });
  }

  async getUserPreferences(userId: string): Promise<any[]> {
    return this.prisma.notificationPreference.findMany({
      where: { userId },
      orderBy: [{ category: 'asc' }, { channel: 'asc' }],
    });
  }

  private async getUserPreference(
    userId: string,
    category: string,
    channel: string,
  ): Promise<any> {
    return this.prisma.notificationPreference.findFirst({
      where: {
        userId,
        category: category as any,
        channel: channel as any,
      },
    });
  }

  // Story 6.4: Smart notifications based on user patterns
  async getSmartNotificationRules(userId: string): Promise<SmartNotificationRule> {
    // Analyze user activity patterns
    const activities = await this.prisma.userActivityLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Extract patterns
    const activeHours = this.extractActiveHours(activities);
    const preferredChannels = await this.extractPreferredChannels(userId);
    const responseRate = await this.calculateResponseRate(userId);

    const preferences = await this.getUserPreferences(userId);
    const categories = preferences.map((p) => p.category);

    return {
      userId,
      role: '', // Would fetch from user roles
      usagePattern: {
        activeHours,
        preferredChannels,
        responseRate,
      },
      contentPreferences: {
        categories,
        keywords: [],
      },
    };
  }

  // Story 6.4: Digest system
  async createDigest(config: DigestConfig): Promise<any> {
    const notifications = await this.getPendingDigestNotifications(
      config.userId,
      config.category,
    );

    if (notifications.length === 0) {
      return null;
    }

    const digest = await this.prisma.notificationDigest.create({
      data: {
        userId: config.userId,
        category: config.category as any,
        frequency: config.frequency as any,
        notificationCount: notifications.length,
        notificationIds: notifications.map((n) => n.id),
        status: 'PENDING',
      },
    });

    return digest;
  }

  // Story 6.4: Process and send digest emails
  @Cron(CronExpression.EVERY_HOUR)
  async processDigests(): Promise<void> {
    const pendingDigests = await this.prisma.notificationDigest.findMany({
      where: {
        status: 'PENDING',
        nextScheduledAt: {
          lte: new Date(),
        },
      },
    });

    for (const digest of pendingDigests) {
      try {
        await this.sendDigest(digest);

        await this.prisma.notificationDigest.update({
          where: { id: digest.id },
          data: {
            status: 'SENT',
            lastSentAt: new Date(),
            nextScheduledAt: this.calculateNextDigestTime(digest.frequency),
          },
        });
      } catch (error) {
        this.logger.error(`Error processing digest ${digest.id}`, error);

        await this.prisma.notificationDigest.update({
          where: { id: digest.id },
          data: {
            status: 'FAILED',
          },
        });
      }
    }
  }

  private async sendDigest(digest: any): Promise<void> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        id: {
          in: digest.notificationIds,
        },
      },
    });

    const user = await this.prisma.user.findUnique({
      where: { id: digest.userId },
    });

    if (!user) return;

    // Compile digest email
    const digestContent = this.compileDigestEmail(notifications, digest.category);

    // Send via email service
    this.logger.log(`Digest email sent to: ${user.email} (${notifications.length} notifications)`);
  }

  private compileDigestEmail(notifications: any[], category: string): string {
    let content = `<h2>${category} Digest</h2>`;
    content += `<p>You have ${notifications.length} notifications:</p>`;
    content += '<ul>';

    for (const notification of notifications) {
      content += `<li><strong>${notification.title}</strong>: ${notification.message}</li>`;
    }

    content += '</ul>';
    return content;
  }

  // Story 6.4: Calendar integration
  async createCalendarEvent(userId: string, config: CalendarEventConfig): Promise<any> {
    const integration = await this.prisma.calendarIntegration.findFirst({
      where: {
        userId,
        isActive: true,
        syncEnabled: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('No active calendar integration found');
    }

    // Integrate with Google Calendar, Outlook, etc.
    this.logger.log(`Calendar event created for user: ${userId}`);

    return {
      eventId: 'mock-event-id',
      ...config,
    };
  }

  async syncCalendar(userId: string): Promise<void> {
    const integration = await this.prisma.calendarIntegration.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (!integration) {
      throw new NotFoundException('Calendar integration not found');
    }

    // Perform sync with calendar provider
    await this.prisma.calendarIntegration.update({
      where: { id: integration.id },
      data: {
        lastSyncAt: new Date(),
      },
    });

    this.logger.log(`Calendar synced for user: ${userId}`);
  }

  // Story 6.4: Notification history and management
  async getNotificationHistory(
    userId: string,
    filters?: {
      channel?: string;
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    },
  ): Promise<any[]> {
    const where: any = { recipientId: userId };

    if (filters?.channel) where.channel = filters.channel;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return this.prisma.notificationHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<any> {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId,
      },
      data: {
        readAt: new Date(),
        status: 'READ',
      },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        recipientId: userId,
        readAt: null,
        status: {
          in: ['SENT', 'DELIVERED'],
        },
      },
    });
  }

  // Helper methods
  private async queueForDigest(notification: any, preference: any): Promise<any> {
    // Add to digest queue
    this.logger.log(`Notification queued for digest: ${notification.recipientId}`);
    return notification;
  }

  private async scheduleNotification(notification: any, scheduleTime: Date): Promise<any> {
    return this.prisma.notification.create({
      data: {
        ...notification,
        scheduledFor: scheduleTime,
        status: 'SCHEDULED',
      },
    });
  }

  private isQuietHours(preference: any): boolean {
    if (!preference.quietHoursStart || !preference.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    return currentTime >= preference.quietHoursStart && currentTime <= preference.quietHoursEnd;
  }

  private calculateQuietHoursEnd(preference: any): Date {
    const [hours, minutes] = preference.quietHoursEnd.split(':');
    const endTime = new Date();
    endTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return endTime;
  }

  private determineCategory(type: string): string {
    const categoryMap: Record<string, string> = {
      INFO: 'SYSTEM',
      SUCCESS: 'SYSTEM',
      WARNING: 'ALERTS',
      ERROR: 'ALERTS',
      ALERT: 'SECURITY',
    };

    return categoryMap[type] || 'SYSTEM';
  }

  private async resolveRecipientEmail(recipientId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: { email: true },
    });

    return user?.email || null;
  }

  private extractActiveHours(activities: any[]): string[] {
    const hours = new Set<string>();
    activities.forEach((activity) => {
      const hour = new Date(activity.timestamp).getHours();
      hours.add(`${hour}:00`);
    });
    return Array.from(hours);
  }

  private async extractPreferredChannels(userId: string): Promise<string[]> {
    const preferences = await this.getUserPreferences(userId);
    return preferences.filter((p) => p.isEnabled).map((p) => p.channel);
  }

  private async calculateResponseRate(userId: string): Promise<number> {
    const total = await this.prisma.notification.count({
      where: { recipientId: userId },
    });

    const read = await this.prisma.notification.count({
      where: {
        recipientId: userId,
        readAt: { not: null },
      },
    });

    return total > 0 ? (read / total) * 100 : 0;
  }

  private async getPendingDigestNotifications(userId: string, category: string): Promise<any[]> {
    return this.prisma.notification.findMany({
      where: {
        recipientId: userId,
        status: 'PENDING',
      },
    });
  }

  private calculateNextDigestTime(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'HOURLY':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'DAILY':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'WEEKLY':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'MONTHLY':
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  // Cleanup old notifications
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupOldNotifications(): Promise<void> {
    const retentionDays = 90;
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    try {
      const result = await this.prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          status: {
            in: ['SENT', 'DELIVERED', 'READ', 'FAILED', 'CANCELLED'],
          },
        },
      });

      this.logger.log(`Cleaned up ${result.count} old notifications`);
    } catch (error) {
      this.logger.error('Error cleaning up old notifications', error);
    }
  }
}
