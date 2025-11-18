import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { MedicalImage } from '../medical-imaging/entities/medical-image.entity';
import { QualityMetric } from './entities/quality-metric.entity';
import { QualityScore, QualityRecommendation, QualityTrend } from './interfaces/quality.interface';

@Injectable()
export class QualityService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(MedicalImage)
    private imageRepository: Repository<MedicalImage>,
    @InjectRepository(QualityMetric)
    private qualityMetricRepository: Repository<QualityMetric>,
  ) {}

  async calculateQualityScore(patientId: string): Promise<QualityScore> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['images', 'treatments', 'followUps']
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
      { field: 'idNumber', weight: 8 },
      { field: 'birthDate', weight: 8 },
      { field: 'gender', weight: 8 },
      { field: 'diagnosisDate', weight: 8 }
    ];

    let requiredScore = 0;
    for (const { field, weight } of requiredFields) {
      if (patient[field as keyof Patient]) {
        requiredScore += weight;
      } else {
        recommendations.push({
          type: 'missing_field',
          priority: 'high',
          message: `Missing required field: ${field}`,
          field: field as keyof Patient
        });
      }
    }
    score += requiredScore;

    // Medical information completeness (25 points)
    const medicalFields = [
      { field: 'tumorType', weight: 10 },
      { field: 'stage', weight: 8 },
      { field: 'medicalHistory', weight: 7 }
    ];

    let medicalScore = 0;
    for (const { field, weight } of medicalFields) {
      if (patient[field as keyof Patient]) {
        medicalScore += weight;
      } else {
        recommendations.push({
          type: 'missing_medical_info',
          priority: 'medium',
          message: `Add medical information: ${field}`,
          field: field as keyof Patient
        });
      }
    }
    score += medicalScore;

    // Family history and previous treatments (10 points)
    if (patient.familyHistory) {
      score += 5;
    } else {
      recommendations.push({
        type: 'missing_family_history',
        priority: 'low',
        message: 'Consider adding family history for better risk assessment'
      });
    }

    if (patient.previousTreatments) {
      score += 5;
    } else {
      recommendations.push({
        type: 'missing_treatment_history',
        priority: 'medium',
        message: 'Document previous treatments for comprehensive care'
      });
    }

    // Imaging documentation (15 points)
    const imageCount = patient.images?.length || 0;
    if (imageCount >= 3) {
      score += 15;
    } else if (imageCount >= 1) {
      score += imageCount * 5;
      recommendations.push({
        type: 'insufficient_imaging',
        priority: 'medium',
        message: `Consider adding more diagnostic images (${3 - imageCount} more recommended)`
      });
    } else {
      recommendations.push({
        type: 'missing_imaging',
        priority: 'high',
        message: 'No diagnostic images found. Add relevant medical imaging.'
      });
    }

    // Treatment planning (10 points)
    if (patient.treatments && patient.treatments.length > 0) {
      const latestTreatment = patient.treatments[patient.treatments.length - 1];
      if (latestTreatment.plan && latestTreatment.startDate) {
        score += 10;
      } else {
        score += 5;
        recommendations.push({
          type: 'incomplete_treatment_plan',
          priority: 'high',
          message: 'Complete treatment plan details'
        });
      }
    } else {
      recommendations.push({
        type: 'missing_treatment_plan',
        priority: 'high',
        message: 'Create treatment plan for patient care'
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
      imageCount,
      recommendations: recommendations.length
    });

    return {
      score: Math.round(score),
      completeness: Math.round(overallCompleteness * 100),
      requiredCompleteness: Math.round(requiredCompleteness * 100),
      medicalCompleteness: Math.round(medicalCompleteness * 100),
      imageCount,
      recommendations,
      lastUpdated: new Date(),
      category: this.getQualityCategory(score)
    };
  }

  async getQualityTrends(patientId: string, days: number = 30): Promise<QualityTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await this.qualityMetricRepository.find({
      where: {
        patientId,
        createdAt: { $gte: startDate }
      },
      order: { createdAt: 'ASC' }
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
    const patients = await this.patientRepository.find({
      where: { centerId }
    });

    const scores = await Promise.all(
      patients.map(patient => this.calculateQualityScore(patient.id))
    );

    const totalPatients = scores.length;
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
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalPatients) * 100)
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
    const latestMetrics = await this.qualityMetricRepository.find({
      order: { createdAt: 'DESC' },
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
    const metric = this.qualityMetricRepository.create({
      patientId,
      score: data.score,
      completeness: Math.round((data.requiredCompleteness + data.medicalCompleteness) * 50),
      requiredCompleteness: Math.round(data.requiredCompleteness * 100),
      medicalCompleteness: Math.round(data.medicalCompleteness * 100),
      imageCount: data.imageCount,
      recommendations: data.recommendations
    });

    await this.qualityMetricRepository.save(metric);
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
    }, {});

    return Object.entries(weeklyData)
      .map(([week, data]: [string, any]) => ({
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
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['images', 'treatments']
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
    if (!patient.idNumber) errors.push('Patient ID number is required');
    if (!patient.birthDate) errors.push('Birth date is required');
    if (!patient.gender) errors.push('Gender is required');
    if (!patient.diagnosisDate) errors.push('Diagnosis date is required');

    // Validate ID number format
    if (patient.idNumber) {
      const idPattern = /^[0-9]{16}$/; // Indonesian KTP pattern
      if (!idPattern.test(patient.idNumber)) {
        warnings.push('ID number format may be invalid (expected 16 digits)');
      }
    }

    // Validate dates
    if (patient.birthDate && patient.diagnosisDate) {
      const birth = new Date(patient.birthDate);
      const diagnosis = new Date(patient.diagnosisDate);
      const now = new Date();

      if (birth >= diagnosis) {
        errors.push('Birth date cannot be after diagnosis date');
      }

      if (birth >= now) {
        errors.push('Birth date cannot be in the future');
      }

      if (diagnosis > now) {
        warnings.push('Diagnosis date is in the future');
      }

      const ageAtDiagnosis = diagnosis.getFullYear() - birth.getFullYear();
      if (ageAtDiagnosis > 120 || ageAtDiagnosis < 0) {
        warnings.push('Patient age at diagnosis seems unrealistic');
      }
    }

    // Validate medical data consistency
    if (patient.stage && !patient.tumorType) {
      warnings.push('Cancer stage specified but tumor type is missing');
    }

    // Validate imaging data
    const images = patient.images || [];
    if (images.length === 0) {
      warnings.push('No medical imaging available');
    } else {
      const hasDicom = images.some(img => img.category === 'dicom');
      if (!hasDicom) {
        warnings.push('No DICOM images found (recommended for cancer diagnosis)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}