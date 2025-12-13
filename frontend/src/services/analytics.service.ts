import apiClient from './api.config';

export interface DashboardSummary {
  totalPatients: number;
  totalCenters: number;
  totalMstsScores: number;
  totalFollowUpVisits: number;
  overallSalvageRate: number;
  averageMstsScore: number;
  monthlyTrend: MstsTrend[];
}

export interface LimbSalvageRate {
  centerId: string;
  centerName: string;
  totalCases: number;
  limbSalvage: number;
  amputation: number;
  salvageRate: number;
}

export interface MstsTrend {
  month: string;
  averageScore: number;
  totalAssessments: number;
  excellentCount: number;
  goodCount: number;
  fairCount: number;
  poorCount: number;
}

export interface TreatmentEffectiveness {
  treatmentModality: string;
  totalPatients: number;
  averageMstsScore: number;
  salvageRate: number;
  recurrenceRate: number;
  survivalRate: number;
}

export interface WhoClassificationDistribution {
  classification: string;
  count: number;
  percentage: number;
}

export interface SurvivalAnalysis {
  tumorType: string;
  totalPatients: number;
  oneYearSurvival: number;
  threeYearSurvival: number;
  fiveYearSurvival: number;
  averageSurvivalMonths: number;
}

export interface CenterPerformance {
  centerId: string;
  centerName: string;
  totalPatients: number;
  averageMstsScore: number;
  salvageRate: number;
  completedFollowUpRate: number;
  dataCompletenessScore: number;
}

export interface FollowUpCompliance {
  centerId?: string;
  centerName?: string;
  totalScheduled: number;
  completed: number;
  missed: number;
  cancelled: number;
  complianceRate: number;
  averageDelayDays: number;
}

class AnalyticsService {
  /**
   * Get overall dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get<DashboardSummary>('/analytics/dashboard-summary');
    return response.data;
  }

  /**
   * Get limb salvage rate by center
   */
  async getLimbSalvageRate(): Promise<LimbSalvageRate[]> {
    const response = await apiClient.get<LimbSalvageRate[]>('/analytics/limb-salvage-rate');
    return response.data;
  }

  /**
   * Get MSTS score trends over time
   */
  async getMstsTrends(months: number = 12): Promise<MstsTrend[]> {
    const response = await apiClient.get<MstsTrend[]>('/analytics/msts-trends', {
      params: { months },
    });
    return response.data;
  }

  /**
   * Get treatment effectiveness comparison
   */
  async getTreatmentEffectiveness(): Promise<TreatmentEffectiveness[]> {
    const response = await apiClient.get<TreatmentEffectiveness[]>(
      '/analytics/treatment-effectiveness'
    );
    return response.data;
  }

  /**
   * Get WHO classification distribution
   */
  async getWhoClassificationDistribution(): Promise<WhoClassificationDistribution[]> {
    const response = await apiClient.get<WhoClassificationDistribution[]>(
      '/analytics/who-classification-distribution'
    );
    return response.data;
  }

  /**
   * Get 5-year survival analysis
   */
  async getSurvivalAnalysis(): Promise<SurvivalAnalysis[]> {
    const response = await apiClient.get<SurvivalAnalysis[]>('/analytics/survival-analysis');
    return response.data;
  }

  /**
   * Get center performance comparison
   */
  async getCenterPerformance(): Promise<CenterPerformance[]> {
    const response = await apiClient.get<CenterPerformance[]>('/analytics/center-performance');
    return response.data;
  }

  /**
   * Get follow-up compliance tracking
   */
  async getFollowUpCompliance(centerId?: string): Promise<FollowUpCompliance[]> {
    const params = centerId ? { centerId } : {};
    const response = await apiClient.get<FollowUpCompliance[]>(
      '/analytics/follow-up-compliance',
      { params }
    );
    return response.data;
  }

  /**
   * Helper: Get performance color class based on score
   */
  getPerformanceColor(score: number, type: 'msts' | 'rate' | 'compliance'): string {
    if (type === 'msts') {
      if (score >= 24) return 'green';
      if (score >= 18) return 'yellow';
      if (score >= 12) return 'orange';
      return 'red';
    }

    if (type === 'rate' || type === 'compliance') {
      if (score >= 80) return 'green';
      if (score >= 60) return 'yellow';
      if (score >= 40) return 'orange';
      return 'red';
    }

    return 'gray';
  }

  /**
   * Helper: Format percentage
   */
  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  /**
   * Helper: Format number with commas
   */
  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}

export default new AnalyticsService();
