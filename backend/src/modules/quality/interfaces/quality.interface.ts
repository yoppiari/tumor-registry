export interface QualityScore {
  score: number;
  completeness: number;
  requiredCompleteness: number;
  medicalCompleteness: number;
  imageCount: number;
  recommendations: QualityRecommendation[];
  lastUpdated: Date;
  category: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface QualityRecommendation {
  type: string;
  priority: 'high' | 'medium' | 'low';
  message: string;
  field?: string;
}

export interface QualityTrend {
  date: Date;
  score: number;
  completeness: number;
  imageCount: number;
  recommendations: number;
}
