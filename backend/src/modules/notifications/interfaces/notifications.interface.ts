export interface NotificationConfig {
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT' | 'REMINDER';
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH' | 'WEBHOOK' | 'SLACK';
}

export interface SendNotificationRequest {
  recipientId: string;
  recipientType: 'USER' | 'ROLE' | 'EMAIL' | 'GROUP';
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH' | 'WEBHOOK';
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'ALERT';
  title: string;
  message: string;
  data?: Record<string, any>;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  scheduledFor?: Date;
  expiresAt?: Date;
  templateId?: string;
}

export interface NotificationPreferenceConfig {
  userId: string;
  category: string;
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'PUSH';
  isEnabled: boolean;
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  quietHours?: {
    start: string; // HH:MM format
    end: string;
  };
  digestSchedule?: string; // cron expression
}

export interface DigestConfig {
  userId: string;
  category: string;
  frequency: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  maxNotifications?: number;
  template?: string;
}

export interface SmartNotificationRule {
  userId: string;
  role: string;
  usagePattern: {
    activeHours: string[];
    preferredChannels: string[];
    responseRate: number;
  };
  contentPreferences: {
    categories: string[];
    keywords: string[];
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  sound?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface CalendarEventConfig {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  reminders?: {
    method: 'email' | 'popup' | 'sms';
    minutes: number;
  }[];
}
