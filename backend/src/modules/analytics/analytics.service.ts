import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private prisma: PrismaService) {}

  async getDashboardData(centerId?: string, timeRange?: string) {
    try {
      const timeRangeDays = this.parseTimeRange(timeRange || '30d');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRangeDays);

      // Get patient statistics
      const totalPatients = await this.prisma.patient.count({
        where: centerId ? { centerId } : {},
      });

      const newPatients = await this.prisma.patient.count({
        where: {
          ...(centerId && { centerId }),
          createdAt: { gte: startDate },
        },
      });

      // Get medical records statistics
      const totalRecords = await this.prisma.medicalRecord.count({
        where: centerId ? { patient: { centerId } } : {},
      });

      // Simulate cancer type distribution (since we don't have full data yet)
      const cancerDistribution = [
        { type: 'Payudara', count: Math.floor(Math.random() * 100) + 50 },
        { type: 'Paru-paru', count: Math.floor(Math.random() * 80) + 40 },
        { type: 'Serviks', count: Math.floor(Math.random() * 60) + 30 },
        { type: 'Hati', count: Math.floor(Math.random() * 40) + 20 },
        { type: 'Lainnya', count: Math.floor(Math.random() * 30) + 15 },
      ];

      return {
        totalPatients,
        newPatients,
        totalRecords,
        cancerDistribution,
        timeRange: timeRange || '30d',
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getCancerStatistics(provinceId?: string, cancerType?: string) {
    try {
      // Mock data for demonstration - in real implementation this would query actual data
      const statistics = {
        totalCases: 5420,
        newCasesThisMonth: 234,
        mostCommonCancers: [
          { type: 'Payudara', cases: 1823, percentage: 33.6 },
          { type: 'Paru-paru', cases: 1456, percentage: 26.9 },
          { type: 'Serviks', cases: 876, percentage: 16.2 },
          { type: 'Hati', cases: 543, percentage: 10.0 },
          { type: 'Usus Besar', cases: 322, percentage: 5.9 },
          { type: 'Lainnya', cases: 400, percentage: 7.4 },
        ],
        demographics: {
          averageAge: 52.3,
          genderDistribution: {
            perempuan: 62.5,
            laki: 37.5,
          },
          ageGroups: [
            { group: '<30', percentage: 5.2 },
            { group: '30-44', percentage: 23.8 },
            { group: '45-59', percentage: 41.5 },
            { group: '60+', percentage: 29.5 },
          ],
        },
        geographicDistribution: [
          { province: 'DKI Jakarta', cases: 1234 },
          { province: 'Jawa Barat', cases: 987 },
          { province: 'Jawa Tengah', cases: 765 },
          { province: 'Jawa Timur', cases: 823 },
          { province: 'Sumatera Utara', cases: 543 },
        ],
      };

      return statistics;
    } catch (error) {
      this.logger.error('Error fetching cancer statistics:', error);
      throw error;
    }
  }

  async getCancerTrends(period: string = 'monthly') {
    try {
      // Mock trend data
      const monthlyData = [
        { month: '2024-01', cases: 423, trend: 0 },
        { month: '2024-02', cases: 456, trend: 1 },
        { month: '2024-03', cases: 434, trend: -1 },
        { month: '2024-04', cases: 467, trend: 1 },
        { month: '2024-05', cases: 489, trend: 1 },
        { month: '2024-06', cases: 512, trend: 1 },
      ];

      const quarterlyData = [
        { quarter: '2023-Q1', cases: 1298 },
        { quarter: '2023-Q2', cases: 1354 },
        { quarter: '2023-Q3', cases: 1423 },
        { quarter: '2023-Q4', cases: 1456 },
        { quarter: '2024-Q1', cases: 1313 },
        { quarter: '2024-Q2', cases: 1468 },
      ];

      return {
        period,
        data: period === 'quarterly' ? quarterlyData : monthlyData,
        growth: 7.5, // percentage growth
      };
    } catch (error) {
      this.logger.error('Error fetching cancer trends:', error);
      throw error;
    }
  }

  async getCenterPerformance() {
    try {
      // Mock center performance data
      return {
        totalCenters: 45,
        activeCenters: 42,
        performance: [
          { centerName: 'RSCM Jakarta', totalPatients: 1234, dataQuality: 95.2, rank: 1 },
          { centerName: 'RSUP Dr. Sardjito', totalPatients: 987, dataQuality: 92.1, rank: 2 },
          { centerName: 'RSUP Kariadi', totalPatients: 876, dataQuality: 88.7, rank: 3 },
          { centerName: 'RSUP Hasan Sadikin', totalPatients: 765, dataQuality: 91.3, rank: 4 },
          { centerName: 'RSUP Cipto Mangunkusumo', totalPatients: 654, dataQuality: 89.8, rank: 5 },
        ],
        averageQuality: 91.4,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error fetching center performance:', error);
      throw error;
    }
  }

  private parseTimeRange(timeRange: string): number {
    const ranges: { [key: string]: number } = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };
    return ranges[timeRange] || 30;
  }
}