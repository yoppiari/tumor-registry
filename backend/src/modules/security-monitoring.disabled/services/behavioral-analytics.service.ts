import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';

@Injectable()
export class BehavioralAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async analyzeUserBehavior(userId: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get user's activity patterns
    const activities = await this.prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (activities.length === 0) {
      return {
        userId,
        hasEnoughData: false,
        message: 'Not enough activity data for behavioral analysis',
      };
    }

    // Analyze activity patterns
    const hourlyActivity = this.analyzeActivityByHour(activities);
    const dayOfWeekActivity = this.analyzeActivityByDayOfWeek(activities);
    const actionFrequency = this.analyzeActionFrequency(activities);
    const anomalies = await this.detectBehavioralAnomalies(userId, activities);

    // Calculate risk score
    const riskScore = this.calculateRiskScore(anomalies, actionFrequency);

    // Get baseline behavior
    const baseline = await this.getBaselineBehavior(userId);

    return {
      userId,
      hasEnoughData: true,
      period: {
        days,
        from: since,
        to: new Date(),
      },
      activitySummary: {
        totalActions: activities.length,
        uniqueActions: new Set(activities.map((a) => a.action)).size,
        averagePerDay: activities.length / days,
      },
      patterns: {
        hourlyActivity,
        dayOfWeekActivity,
        actionFrequency,
      },
      anomalies,
      riskScore,
      baseline,
      recommendations: this.generateRecommendations(riskScore, anomalies),
    };
  }

  private analyzeActivityByHour(activities: any[]): any {
    const hourCounts = new Array(24).fill(0);

    for (const activity of activities) {
      const hour = activity.createdAt.getHours();
      hourCounts[hour]++;
    }

    const total = activities.length;
    return hourCounts.map((count, hour) => ({
      hour,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  private analyzeActivityByDayOfWeek(activities: any[]): any {
    const dayCounts = new Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (const activity of activities) {
      const day = activity.createdAt.getDay();
      dayCounts[day]++;
    }

    const total = activities.length;
    return dayCounts.map((count, day) => ({
      day: dayNames[day],
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  private analyzeActionFrequency(activities: any[]): any {
    const actionCounts: any = {};

    for (const activity of activities) {
      actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
    }

    return Object.entries(actionCounts)
      .map(([action, count]) => ({
        action,
        count,
        percentage: ((count as number) / activities.length) * 100,
      }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 20); // Top 20 actions
  }

  private async detectBehavioralAnomalies(userId: string, recentActivities: any[]): Promise<any[]> {
    const anomalies: any[] = [];

    // Get user's historical baseline (last 90 days before the analyzed period)
    const historicalStart = new Date(recentActivities[0].createdAt.getTime() - 90 * 24 * 60 * 60 * 1000);
    const historicalEnd = recentActivities[0].createdAt;

    const historicalActivities = await this.prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: historicalStart,
          lt: historicalEnd,
        },
      },
    });

    if (historicalActivities.length < 10) {
      return []; // Not enough historical data
    }

    // Detect unusual activity volume
    const recentAvgPerDay = recentActivities.length / 30;
    const historicalAvgPerDay = historicalActivities.length / 90;

    if (recentAvgPerDay > historicalAvgPerDay * 2) {
      anomalies.push({
        type: 'UNUSUAL_ACTIVITY_VOLUME',
        severity: 'MEDIUM',
        description: `Activity increased by ${((recentAvgPerDay / historicalAvgPerDay - 1) * 100).toFixed(0)}%`,
        details: {
          recent: recentAvgPerDay,
          baseline: historicalAvgPerDay,
        },
      });
    }

    // Detect unusual actions
    const historicalActions = new Set(historicalActivities.map((a) => a.action));
    const newActions = recentActivities
      .map((a) => a.action)
      .filter((action) => !historicalActions.has(action));

    if (newActions.length > 0) {
      anomalies.push({
        type: 'NEW_ACTIONS',
        severity: 'LOW',
        description: `User performed ${newActions.length} new types of actions`,
        details: {
          newActions: [...new Set(newActions)],
        },
      });
    }

    // Detect unusual time patterns
    const historicalHours = historicalActivities.map((a) => a.createdAt.getHours());
    const recentHours = recentActivities.map((a) => a.createdAt.getHours());

    const avgHistoricalHour = historicalHours.reduce((a, b) => a + b, 0) / historicalHours.length;
    const avgRecentHour = recentHours.reduce((a, b) => a + b, 0) / recentHours.length;

    if (Math.abs(avgRecentHour - avgHistoricalHour) > 4) {
      anomalies.push({
        type: 'UNUSUAL_TIME_PATTERN',
        severity: 'MEDIUM',
        description: 'User activity shifted to unusual hours',
        details: {
          historicalAvgHour: avgHistoricalHour.toFixed(1),
          recentAvgHour: avgRecentHour.toFixed(1),
        },
      });
    }

    return anomalies;
  }

  private calculateRiskScore(anomalies: any[], actionFrequency: any[]): number {
    let score = 0;

    // Base score from anomalies
    for (const anomaly of anomalies) {
      if (anomaly.severity === 'CRITICAL') score += 30;
      else if (anomaly.severity === 'HIGH') score += 20;
      else if (anomaly.severity === 'MEDIUM') score += 10;
      else if (anomaly.severity === 'LOW') score += 5;
    }

    // Check for suspicious actions
    const suspiciousActions = ['DELETE', 'EXPORT', 'BULK_DOWNLOAD', 'PERMISSION_CHANGE'];
    const suspiciousCount = actionFrequency.filter((a) =>
      suspiciousActions.some((sa) => a.action.includes(sa)),
    ).length;

    score += suspiciousCount * 5;

    return Math.min(100, score); // Cap at 100
  }

  private async getBaselineBehavior(userId: string): Promise<any> {
    // Get baseline from last 90 days
    const baseline = await this.prisma.behavioralBaseline.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!baseline) {
      // Create baseline if doesn't exist
      return {
        exists: false,
        message: 'No baseline established yet',
      };
    }

    return {
      exists: true,
      averageActivityPerDay: baseline.avgActivityPerDay,
      commonActions: baseline.commonActions,
      typicalHours: baseline.typicalHours,
      lastUpdated: baseline.createdAt,
    };
  }

  private generateRecommendations(riskScore: number, anomalies: any[]): string[] {
    const recommendations: string[] = [];

    if (riskScore > 70) {
      recommendations.push('High risk detected. Consider mandatory security review.');
      recommendations.push('Enable additional authentication for sensitive operations.');
    } else if (riskScore > 40) {
      recommendations.push('Moderate risk detected. Monitor user activity closely.');
      recommendations.push('Review recent actions for policy compliance.');
    }

    if (anomalies.some((a) => a.type === 'UNUSUAL_ACTIVITY_VOLUME')) {
      recommendations.push('Verify the increase in activity is legitimate.');
    }

    if (anomalies.some((a) => a.type === 'UNUSUAL_TIME_PATTERN')) {
      recommendations.push('Confirm user is accessing from authorized location.');
    }

    if (recommendations.length === 0) {
      recommendations.push('No immediate concerns. Continue normal monitoring.');
    }

    return recommendations;
  }

  async createBaseline(userId: string) {
    // Analyze last 90 days of activity
    const activities = await this.prisma.auditLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (activities.length < 50) {
      return {
        success: false,
        message: 'Not enough activity data to create baseline (minimum 50 actions)',
      };
    }

    const avgActivityPerDay = activities.length / 90;
    const actionFrequency = this.analyzeActionFrequency(activities);
    const hourlyActivity = this.analyzeActivityByHour(activities);

    const baseline = await this.prisma.behavioralBaseline.create({
      data: {
        userId,
        avgActivityPerDay,
        commonActions: actionFrequency.slice(0, 10).map((a) => a.action),
        typicalHours: hourlyActivity.filter((h) => h.percentage > 5).map((h) => h.hour),
        dataPoints: activities.length,
      },
    });

    return {
      success: true,
      baseline,
    };
  }
}
