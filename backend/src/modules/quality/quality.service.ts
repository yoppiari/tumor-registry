import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { QualityScore, QualityRecommendation, QualityTrend } from './interfaces/quality.interface';

@Injectable()
export class QualityService {
  private readonly logger = new Logger(QualityService.name);

  constructor(private prisma: PrismaService) {}

  async calculateQualityScore(patientId: string): Promise<QualityScore> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        diagnoses: true,
        medicalRecords: true,
        procedures: true,
        visits: true,
        medications: true,
        laboratoryResults: true,
      }
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    let score = 0;
    const maxScore = 100;
    const recommendations: QualityRecommendation[] = [];

    // Required fields check (40 points)
    const requiredFields = [
      { field: 'name', weight: 8 },
      { field: 'nik', weight: 8 },
      { field: 'dateOfBirth', weight: 8 },
      { field: 'gender', weight: 8 },
      { field: 'medicalRecordNumber', weight: 8 }
    ];

    let requiredScore = 0;
    for (const { field, weight } of requiredFields) {
      if (patient[field as keyof typeof patient]) {
        requiredScore += weight;
      } else {
        recommendations.push({
          type: 'missing_field',
          priority: 'high',
          message: `Missing required field: ${field}`,
          field: field
        });
      }
    }
    score += requiredScore;

    // Medical information completeness (25 points)
    const hasDiagnosis = patient.diagnoses && patient.diagnoses.length > 0;
    const hasMedicalRecords = patient.medicalRecords && patient.medicalRecords.length > 0;
    const hasProcedures = patient.procedures && patient.procedures.length > 0;

    let medicalScore = 0;

    if (hasDiagnosis) {
      medicalScore += 10;
      const latestDiagnosis = patient.diagnoses[patient.diagnoses.length - 1];

      // Check if diagnosis has comprehensive information
      if (latestDiagnosis.diagnosisName && latestDiagnosis.diagnosisCode) {
        medicalScore += 5;
      } else {
        recommendations.push({
          type: 'missing_medical_info',
          priority: 'medium',
          message: 'Complete diagnosis information (code and name)',
          field: 'diagnosisInfo'
        });
      }

      if (latestDiagnosis.severity) {
        medicalScore += 5;
      } else {
        recommendations.push({
          type: 'missing_medical_info',
          priority: 'medium',
          message: 'Add diagnosis severity information',
          field: 'severity'
        });
      }
    } else {
      recommendations.push({
        type: 'missing_medical_info',
        priority: 'high',
        message: 'Add diagnosis information'
      });
    }

    if (hasMedicalRecords) {
      medicalScore += 5;
    } else {
      recommendations.push({
        type: 'missing_medical_info',
        priority: 'medium',
        message: 'Add medical records'
      });
    }

    score += medicalScore;

    // Family history and medical history (10 points)
    if (hasMedicalRecords && patient.medicalRecords.some(record => record.familyHistory)) {
      score += 5;
    } else {
      recommendations.push({
        type: 'missing_family_history',
        priority: 'low',
        message: 'Consider adding family history for better risk assessment'
      });
    }

    if (hasProcedures) {
      score += 5;
    } else {
      recommendations.push({
        type: 'missing_treatment_history',
        priority: 'medium',
        message: 'Document procedures for comprehensive care'
      });
    }

    // Laboratory results documentation (15 points)
    const labResultCount = patient.laboratoryResults?.length || 0;
    if (labResultCount >= 3) {
      score += 15;
    } else if (labResultCount >= 1) {
      score += labResultCount * 5;
      recommendations.push({
        type: 'insufficient_lab_results',
        priority: 'medium',
        message: `Consider adding more laboratory results (${3 - labResultCount} more recommended)`
      });
    } else {
      recommendations.push({
        type: 'missing_lab_results',
        priority: 'high',
        message: 'No laboratory results found. Add relevant test results.'
      });
    }

    // Treatment and medication planning (10 points)
    if (patient.medications && patient.medications.length > 0) {
      const activeMedications = patient.medications.filter(med => med.isActive);
      if (activeMedications.length > 0) {
        score += 10;
      } else {
        score += 5;
        recommendations.push({
          type: 'incomplete_treatment_plan',
          priority: 'high',
          message: 'Update current medication status'
        });
      }
    } else {
      recommendations.push({
        type: 'missing_treatment_plan',
        priority: 'high',
        message: 'Create medication plan for patient care'
      });
    }

    // Calculate completeness percentages
    const requiredCompleteness = requiredScore / 40;
    const medicalCompleteness = medicalScore / 25;
    const overallCompleteness = score / maxScore;

    // Save quality metric
    await this.saveQualityMetric(patientId, {
      score: Math.round(score),
      requiredCompleteness,
      medicalCompleteness,
      imageCount: labResultCount,
      recommendations: recommendations.length
    });

    return {
      score: Math.round(score),
      completeness: Math.round(overallCompleteness * 100),
      requiredCompleteness: Math.round(requiredCompleteness * 100),
      medicalCompleteness: Math.round(medicalCompleteness * 100),
      imageCount: labResultCount,
      recommendations,
      lastUpdated: new Date(),
      category: this.getQualityCategory(score)
    };
  }

  async getQualityTrends(patientId: string, days: number = 30): Promise<QualityTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await this.prisma.qualityMetric.findMany({
      where: {
        patientId,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return metrics.map(metric => ({
      date: metric.createdAt,
      score: metric.score,
      completeness: metric.completeness,
      imageCount: metric.imageCount,
      recommendations: metric.recommendations
    }));
  }

  async getCenterQualitySummary(centerId: string): Promise<any> {
    const patients = await this.prisma.patient.findMany({
      where: { centerId }
    });

    const scores = await Promise.all(
      patients.map(patient => this.calculateQualityScore(patient.id))
    );

    const totalPatients = scores.length;

    if (totalPatients === 0) {
      return {
        centerId,
        totalPatients: 0,
        averageScore: 0,
        qualityDistribution: {
          high: 0,
          medium: 0,
          low: 0,
          percentages: { high: 0, medium: 0, low: 0 }
        },
        topRecommendations: [],
        lastUpdated: new Date()
      };
    }

    const averageScore = scores.reduce((sum, score) => sum + score.score, 0) / totalPatients;
    const highQualityCount = scores.filter(score => score.score >= 90).length;
    const mediumQualityCount = scores.filter(score => score.score >= 70 && score.score < 90).length;
    const lowQualityCount = scores.filter(score => score.score < 70).length;

    // Get most common recommendations
    const allRecommendations = scores.flatMap(score => score.recommendations);
    const recommendationTypes = allRecommendations.reduce((acc, rec) => {
      acc[rec.type] = (acc[rec.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topRecommendations = Object.entries(recommendationTypes)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round(((count as number) / totalPatients) * 100)
      }));

    return {
      centerId,
      totalPatients,
      averageScore: Math.round(averageScore),
      qualityDistribution: {
        high: highQualityCount,
        medium: mediumQualityCount,
        low: lowQualityCount,
        percentages: {
          high: Math.round((highQualityCount / totalPatients) * 100),
          medium: Math.round((mediumQualityCount / totalPatients) * 100),
          low: Math.round((lowQualityCount / totalPatients) * 100)
        }
      },
      topRecommendations,
      lastUpdated: new Date()
    };
  }

  async getNationalQualityOverview(): Promise<any> {
    const latestMetrics = await this.prisma.qualityMetric.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 1000 // Get recent metrics for overview
    });

    if (latestMetrics.length === 0) {
      return {
        totalPatients: 0,
        averageScore: 0,
        qualityDistribution: { high: 0, medium: 0, low: 0 },
        trends: []
      };
    }

    const averageScore = latestMetrics.reduce((sum, metric) => sum + metric.score, 0) / latestMetrics.length;
    const highQualityCount = latestMetrics.filter(metric => metric.score >= 90).length;
    const mediumQualityCount = latestMetrics.filter(metric => metric.score >= 70 && metric.score < 90).length;
    const lowQualityCount = latestMetrics.filter(metric => metric.score < 70).length;

    // Calculate trend over time
    const weeklyTrends = this.calculateWeeklyTrends(latestMetrics);

    return {
      totalPatients: latestMetrics.length,
      averageScore: Math.round(averageScore),
      qualityDistribution: {
        high: highQualityCount,
        medium: mediumQualityCount,
        low: lowQualityCount,
        percentages: {
          high: Math.round((highQualityCount / latestMetrics.length) * 100),
          medium: Math.round((mediumQualityCount / latestMetrics.length) * 100),
          low: Math.round((lowQualityCount / latestMetrics.length) * 100)
        }
      },
      trends: weeklyTrends,
      lastUpdated: new Date()
    };
  }

  private async saveQualityMetric(
    patientId: string,
    data: {
      score: number;
      requiredCompleteness: number;
      medicalCompleteness: number;
      imageCount: number;
      recommendations: number;
    }
  ): Promise<void> {
    await this.prisma.qualityMetric.create({
      data: {
        patientId,
        score: data.score,
        completeness: Math.round((data.requiredCompleteness + data.medicalCompleteness) * 50),
        requiredCompleteness: Math.round(data.requiredCompleteness * 100),
        medicalCompleteness: Math.round(data.medicalCompleteness * 100),
        imageCount: data.imageCount,
        recommendations: data.recommendations
      }
    });
  }

  private getQualityCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'poor';
  }

  private calculateWeeklyTrends(metrics: any[]): any[] {
    const weeklyData = metrics.reduce((acc, metric) => {
      const week = this.getWeekNumber(metric.createdAt);
      if (!acc[week]) {
        acc[week] = { total: 0, count: 0, scores: [] };
      }
      acc[week].total += metric.score;
      acc[week].count += 1;
      acc[week].scores.push(metric.score);
      return acc;
    }, {} as Record<number, { total: number; count: number; scores: number[] }>);

    return Object.entries(weeklyData)
      .map(([week, data]: [string, { total: number; count: number; scores: number[] }]) => ({
        week: parseInt(week),
        averageScore: Math.round(data.total / data.count),
        patientCount: data.count,
        minScore: Math.min(...data.scores),
        maxScore: Math.max(...data.scores)
      }))
      .sort((a, b) => a.week - b.week)
      .slice(-12); // Last 12 weeks
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  async validatePatientData(patientId: string): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        diagnoses: true,
        procedures: true,
        laboratoryResults: true
      }
    });

    if (!patient) {
      return {
        isValid: false,
        errors: ['Patient not found'],
        warnings: []
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!patient.name) errors.push('Patient name is required');
    if (!patient.nik) errors.push('Patient NIK (ID number) is required');
    if (!patient.dateOfBirth) errors.push('Birth date is required');
    if (!patient.gender) errors.push('Gender is required');
    if (!patient.medicalRecordNumber) errors.push('Medical record number is required');

    // Validate NIK format (Indonesian KTP pattern - 16 digits)
    if (patient.nik) {
      const nikPattern = /^[0-9]{16}$/;
      if (!nikPattern.test(patient.nik)) {
        warnings.push('NIK format may be invalid (expected 16 digits)');
      }
    }

    // Validate dates
    if (patient.dateOfBirth) {
      const birth = new Date(patient.dateOfBirth);
      const now = new Date();

      if (birth >= now) {
        errors.push('Birth date cannot be in the future');
      }

      // Check if patient has diagnosis
      if (patient.diagnoses && patient.diagnoses.length > 0) {
        for (const diagnosis of patient.diagnoses) {
          if (diagnosis.onsetDate) {
            const onset = new Date(diagnosis.onsetDate);

            if (birth >= onset) {
              errors.push('Birth date cannot be after diagnosis onset date');
            }

            if (onset > now) {
              warnings.push('Diagnosis onset date is in the future');
            }

            const ageAtDiagnosis = onset.getFullYear() - birth.getFullYear();
            if (ageAtDiagnosis > 120 || ageAtDiagnosis < 0) {
              warnings.push('Patient age at diagnosis seems unrealistic');
            }
          }
        }
      }
    }

    // Validate medical data consistency
    if (patient.diagnoses && patient.diagnoses.length > 0) {
      const incompleteDiagnoses = patient.diagnoses.filter(d => !d.diagnosisCode || !d.diagnosisName);
      if (incompleteDiagnoses.length > 0) {
        warnings.push(`${incompleteDiagnoses.length} diagnosis(es) have incomplete information`);
      }
    }

    // Validate laboratory data
    const labResults = patient.laboratoryResults || [];
    if (labResults.length === 0) {
      warnings.push('No laboratory results available');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
