import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import {
  CheckDataAvailabilityDto,
  CalculateSampleSizeDto,
  AssessFeasibilityDto,
  CreateSimilarStudyDto,
  SearchSimilarStudiesDto,
} from '../dto/research-planning.dto';
import { StudyType } from '@prisma/client';

@Injectable()
export class ResearchPlanningService {
  private readonly logger = new Logger(ResearchPlanningService.name);

  constructor(private prisma: PrismaService) {}

  // Data Availability Assessment

  async checkDataAvailability(checkDto: CheckDataAvailabilityDto) {
    try {
      const {
        cancerType,
        province,
        regency,
        yearFrom,
        yearTo,
        requiredFields = [],
      } = checkDto;

      const currentYear = new Date().getFullYear();
      const fromYear = yearFrom || currentYear - 5;
      const toYear = yearTo || currentYear;

      // Check if we have pre-computed availability data
      const availabilityData = await this.prisma.dataAvailability.findMany({
        where: {
          cancerType,
          province: province || undefined,
          regency: regency || undefined,
          yearFrom: { gte: fromYear },
          yearTo: { lte: toYear },
        },
      });

      if (availabilityData.length > 0) {
        return this.aggregateAvailabilityData(availabilityData);
      }

      // If no pre-computed data, calculate from raw data
      return await this.calculateDataAvailability(cancerType, province, regency, fromYear, toYear, requiredFields);
    } catch (error) {
      this.logger.error('Error checking data availability', error);
      throw error;
    }
  }

  private async calculateDataAvailability(
    cancerType: string,
    province: string | undefined,
    regency: string | undefined,
    yearFrom: number,
    yearTo: number,
    requiredFields: string[]
  ) {
    const where: any = {
      cancerType,
      year: { gte: yearFrom, lte: yearTo },
    };

    if (province) where.province = province;
    if (regency) where.regency = regency;

    const [totalRecords, yearlyBreakdown, provinceBreakdown] = await Promise.all([
      this.prisma.cancerGeographicData.count({ where }),
      this.getYearlyBreakdown(where),
      this.getProvinceBreakdown(where),
    ]);

    const dataQuality = await this.assessDataQuality(where);

    return {
      cancerType,
      province,
      regency,
      yearFrom,
      yearTo,
      totalRecords,
      dataQualityScore: dataQuality.score,
      dataQuality: dataQuality.rating,
      yearlyBreakdown,
      provinceBreakdown,
      availableFields: dataQuality.availableFields,
      missingFields: dataQuality.missingFields,
      completeRecords: dataQuality.completeRecords,
      partialRecords: dataQuality.partialRecords,
      lastUpdated: new Date(),
    };
  }

  private aggregateAvailabilityData(data: any[]) {
    const totalRecords = data.reduce((sum, d) => sum + d.totalRecords, 0);
    const completeRecords = data.reduce((sum, d) => sum + d.completeRecords, 0);
    const partialRecords = data.reduce((sum, d) => sum + d.partialRecords, 0);
    const avgQuality = data.reduce((sum, d) => sum + d.dataQualityScore, 0) / data.length;

    return {
      cancerType: data[0].cancerType,
      province: data[0].province,
      regency: data[0].regency,
      yearFrom: Math.min(...data.map(d => d.yearFrom)),
      yearTo: Math.max(...data.map(d => d.yearTo)),
      totalRecords,
      completeRecords,
      partialRecords,
      dataQualityScore: avgQuality,
      availableFields: data[0].availableFields,
      missingFields: data[0].missingFields,
      lastUpdated: new Date(),
    };
  }

  private async getYearlyBreakdown(where: any) {
    const yearlyData = await this.prisma.cancerGeographicData.groupBy({
      by: ['year'],
      where,
      _count: true,
      orderBy: { year: 'asc' },
    });

    return yearlyData.map(d => ({
      year: d.year,
      count: d._count,
    }));
  }

  private async getProvinceBreakdown(where: any) {
    const provinceData = await this.prisma.cancerGeographicData.groupBy({
      by: ['province'],
      where,
      _count: true,
      orderBy: { _count: { province: 'desc' } },
      take: 10,
    });

    return provinceData.map(d => ({
      province: d.province,
      count: d._count,
    }));
  }

  private async assessDataQuality(where: any) {
    const records = await this.prisma.cancerGeographicData.findMany({ where });

    let score = 0;
    let completeRecords = 0;
    let partialRecords = 0;

    const fieldPresence = {
      incidenceRate: 0,
      mortalityRate: 0,
      ageStandardizedRate: 0,
      gender: 0,
      ageGroup: 0,
      stage: 0,
    };

    records.forEach(record => {
      let fieldCount = 0;
      if (record.incidenceRate) { fieldPresence.incidenceRate++; fieldCount++; }
      if (record.mortalityRate) { fieldPresence.mortalityRate++; fieldCount++; }
      if (record.ageStandardizedRate) { fieldPresence.ageStandardizedRate++; fieldCount++; }
      if (record.gender) { fieldPresence.gender++; fieldCount++; }
      if (record.ageGroup) { fieldPresence.ageGroup++; fieldCount++; }
      if (record.stage) { fieldPresence.stage++; fieldCount++; }

      if (fieldCount >= 5) completeRecords++;
      else if (fieldCount >= 2) partialRecords++;
    });

    const totalFields = Object.keys(fieldPresence).length;
    const avgFieldPresence = Object.values(fieldPresence).reduce((a, b) => a + b, 0) / (records.length * totalFields);
    score = avgFieldPresence * 100;

    const availableFields = Object.entries(fieldPresence)
      .filter(([_, count]) => count > records.length * 0.5)
      .map(([field]) => field);

    const missingFields = Object.entries(fieldPresence)
      .filter(([_, count]) => count < records.length * 0.2)
      .map(([field]) => field);

    return {
      score,
      rating: score > 80 ? 'EXCELLENT' : score > 60 ? 'GOOD' : score > 40 ? 'STANDARD' : 'POOR',
      completeRecords,
      partialRecords,
      availableFields,
      missingFields,
    };
  }

  // Sample Size Calculator

  async calculateSampleSize(calculateDto: CalculateSampleSizeDto) {
    try {
      const {
        studyType,
        effectSize = 0.5,
        power = 0.8,
        alpha = 0.05,
        dropoutRate = 0.1,
        numberOfGroups = 2,
        allocationRatio = 1,
      } = calculateDto;

      let sampleSize = 0;
      let formula = '';
      let assumptions: string[] = [];

      switch (studyType) {
        case 'COHORT':
        case 'CASE_CONTROL':
          sampleSize = this.calculateTwoGroupSampleSize(effectSize, power, alpha, allocationRatio);
          formula = 'Two-group comparison formula';
          assumptions = [
            `Effect size (Cohen's d): ${effectSize}`,
            `Power: ${power * 100}%`,
            `Significance level: ${alpha}`,
            `Allocation ratio: ${allocationRatio}`,
          ];
          break;

        case 'CROSS_SECTIONAL':
          if (calculateDto.expectedProportion && calculateDto.confidenceWidth) {
            sampleSize = this.calculateProportionSampleSize(
              calculateDto.expectedProportion,
              calculateDto.confidenceWidth,
              alpha
            );
            formula = 'Single proportion formula';
            assumptions = [
              `Expected proportion: ${calculateDto.expectedProportion}`,
              `Confidence interval width: ${calculateDto.confidenceWidth}`,
            ];
          } else {
            sampleSize = this.calculateTwoGroupSampleSize(effectSize, power, alpha, 1);
            formula = 'Two-group comparison formula';
          }
          break;

        case 'INTERVENTIONAL':
          sampleSize = this.calculateTwoGroupSampleSize(effectSize, power, alpha, allocationRatio);
          sampleSize *= numberOfGroups / 2; // Adjust for multiple arms
          formula = 'Multi-arm trial formula';
          assumptions = [
            `Number of treatment arms: ${numberOfGroups}`,
            `Expected effect size: ${effectSize}`,
          ];
          break;

        default:
          sampleSize = this.calculateTwoGroupSampleSize(effectSize, power, alpha, 1);
          formula = 'Standard two-group formula';
      }

      // Adjust for dropout
      const adjustedSampleSize = Math.ceil(sampleSize / (1 - dropoutRate));

      // Calculate confidence intervals
      const confidenceIntervals = this.calculateConfidenceIntervals(sampleSize, effectSize, alpha);

      return {
        studyType,
        requiredSampleSize: sampleSize,
        adjustedForDropout: adjustedSampleSize,
        dropoutRate,
        formula,
        assumptions,
        confidenceIntervals,
        powerAnalysis: {
          power,
          effectSize,
          alpha,
          detailsBy: numberOfGroups,
        },
        recommendations: this.generateSampleSizeRecommendations(adjustedSampleSize, studyType),
      };
    } catch (error) {
      this.logger.error('Error calculating sample size', error);
      throw error;
    }
  }

  private calculateTwoGroupSampleSize(
    effectSize: number,
    power: number,
    alpha: number,
    allocationRatio: number
  ): number {
    // Using simplified formula: n = 2 * (Z_alpha + Z_beta)^2 / d^2
    // Z_alpha for two-tailed test
    const zAlpha = this.getZScore(alpha / 2);
    const zBeta = this.getZScore(1 - power);

    const n = 2 * Math.pow(zAlpha + zBeta, 2) / Math.pow(effectSize, 2);

    // Adjust for allocation ratio
    const n1 = (n * (1 + allocationRatio)) / Math.pow(allocationRatio, 2);

    return Math.ceil(n1);
  }

  private calculateProportionSampleSize(
    proportion: number,
    width: number,
    alpha: number
  ): number {
    const zAlpha = this.getZScore(alpha / 2);
    const n = (4 * Math.pow(zAlpha, 2) * proportion * (1 - proportion)) / Math.pow(width, 2);
    return Math.ceil(n);
  }

  private getZScore(probability: number): number {
    // Simplified Z-score lookup
    const zScores: { [key: number]: number } = {
      0.005: 2.576,
      0.01: 2.326,
      0.025: 1.96,
      0.05: 1.645,
      0.1: 1.282,
      0.2: 0.842,
    };

    const closest = Object.keys(zScores)
      .map(Number)
      .reduce((prev, curr) =>
        Math.abs(curr - probability) < Math.abs(prev - probability) ? curr : prev
      );

    return zScores[closest];
  }

  private calculateConfidenceIntervals(sampleSize: number, effectSize: number, alpha: number) {
    const margin = this.getZScore(alpha / 2) * Math.sqrt(2 / sampleSize);
    return {
      lower: effectSize - margin,
      upper: effectSize + margin,
      level: (1 - alpha) * 100,
    };
  }

  private generateSampleSizeRecommendations(sampleSize: number, studyType: StudyType): string[] {
    const recommendations: string[] = [];

    if (sampleSize < 30) {
      recommendations.push('Sample size is small. Consider non-parametric statistical methods.');
      recommendations.push('Results may have limited generalizability.');
    } else if (sampleSize < 100) {
      recommendations.push('Adequate sample size for preliminary or pilot studies.');
    } else if (sampleSize > 1000) {
      recommendations.push('Large sample size ensures high statistical power.');
      recommendations.push('Consider cost-effectiveness and recruitment feasibility.');
    }

    if (studyType === 'INTERVENTIONAL') {
      recommendations.push('Consider interim analysis for early stopping rules.');
      recommendations.push('Plan for stratified randomization if appropriate.');
    }

    recommendations.push('Ensure consistent data collection procedures across all participants.');

    return recommendations;
  }

  // Feasibility Assessment

  async assessFeasibility(userId: string, assessDto: AssessFeasibilityDto) {
    try {
      const {
        cancerType,
        studyType,
        desiredSampleSize,
        studyDuration,
        province,
        regency,
        inclusionCriteria,
        exclusionCriteria,
      } = assessDto;

      // Check data availability
      const availability = await this.checkDataAvailability({
        cancerType,
        province,
        regency,
        requiredFields: assessDto.requiredFields,
      });

      // Estimate available subjects
      const estimatedAvailable = availability.totalRecords;

      // Calculate feasibility score
      const feasibilityScore = this.calculateFeasibilityScore(
        desiredSampleSize,
        estimatedAvailable,
        studyDuration,
        availability.dataQualityScore
      );

      // Generate power analysis
      const powerAnalysis = await this.calculateSampleSize({
        studyType,
        effectSize: 0.5,
        power: 0.8,
        alpha: 0.05,
      });

      // Identify barriers and recommendations
      const barriers = this.identifyBarriers(
        desiredSampleSize,
        estimatedAvailable,
        availability.dataQualityScore,
        studyDuration
      );

      const recommendations = this.generateFeasibilityRecommendations(
        feasibilityScore,
        desiredSampleSize,
        estimatedAvailable,
        barriers
      );

      const mitigationStrategies = this.suggestMitigationStrategies(barriers);

      // Estimate costs and timeline
      const estimatedCost = assessDto.costPerParticipant
        ? desiredSampleSize * assessDto.costPerParticipant
        : null;

      const estimatedTimeline = this.estimateTimeline(
        desiredSampleSize,
        estimatedAvailable,
        studyDuration,
        assessDto.expectedRecruitmentRate
      );

      // Save assessment
      const assessment = await this.prisma.feasibilityAssessment.create({
        data: {
          researchRequestId: assessDto.researchRequestId,
          userId,
          studyType,
          cancerType,
          inclusionCriteria,
          exclusionCriteria,
          desiredSampleSize,
          studyDuration,
          estimatedAvailable,
          feasibilityScore,
          powerAnalysis,
          recommendations,
          barriers,
          mitigationStrategies,
          estimatedCost,
          estimatedTimeline,
        },
      });

      this.logger.log(`Feasibility assessment created: ${assessment.id}`);

      return {
        ...assessment,
        dataAvailability: availability,
        interpretation: this.interpretFeasibilityScore(feasibilityScore),
      };
    } catch (error) {
      this.logger.error('Error assessing feasibility', error);
      throw error;
    }
  }

  private calculateFeasibilityScore(
    desired: number,
    available: number,
    duration: number,
    dataQuality: number
  ): number {
    let score = 0;

    // Sample size availability (40 points)
    const availabilityRatio = available / desired;
    if (availabilityRatio >= 2) score += 40;
    else if (availabilityRatio >= 1.5) score += 35;
    else if (availabilityRatio >= 1.2) score += 30;
    else if (availabilityRatio >= 1) score += 25;
    else if (availabilityRatio >= 0.8) score += 15;
    else score += 5;

    // Data quality (30 points)
    score += (dataQuality / 100) * 30;

    // Study duration (20 points)
    if (duration <= 12) score += 20;
    else if (duration <= 24) score += 15;
    else if (duration <= 36) score += 10;
    else score += 5;

    // Recruitment feasibility (10 points)
    const monthlyRecruitmentNeeded = desired / duration;
    if (monthlyRecruitmentNeeded < available / 24) score += 10;
    else if (monthlyRecruitmentNeeded < available / 12) score += 7;
    else score += 3;

    return Math.min(100, Math.round(score));
  }

  private identifyBarriers(
    desired: number,
    available: number,
    dataQuality: number,
    duration: number
  ): any {
    const barriers: any = {
      recruitment: [],
      dataQuality: [],
      timeline: [],
      resource: [],
    };

    if (available < desired) {
      barriers.recruitment.push({
        type: 'insufficient_sample',
        severity: 'HIGH',
        description: `Available subjects (${available}) less than desired (${desired})`,
      });
    }

    if (dataQuality < 60) {
      barriers.dataQuality.push({
        type: 'poor_data_quality',
        severity: 'HIGH',
        description: 'Data quality score below acceptable threshold',
      });
    }

    if (duration > 36) {
      barriers.timeline.push({
        type: 'extended_timeline',
        severity: 'MEDIUM',
        description: 'Study duration exceeds 3 years',
      });
    }

    const monthlyRecruitmentNeeded = desired / duration;
    if (monthlyRecruitmentNeeded > available / 12) {
      barriers.recruitment.push({
        type: 'recruitment_rate',
        severity: 'HIGH',
        description: 'Required recruitment rate may be difficult to achieve',
      });
    }

    return barriers;
  }

  private generateFeasibilityRecommendations(
    score: number,
    desired: number,
    available: number,
    barriers: any
  ): any {
    const recommendations = [];

    if (score >= 80) {
      recommendations.push({
        category: 'Overall',
        priority: 'LOW',
        recommendation: 'Study is highly feasible. Proceed with detailed planning.',
      });
    } else if (score >= 60) {
      recommendations.push({
        category: 'Overall',
        priority: 'MEDIUM',
        recommendation: 'Study is feasible with some modifications. Address identified barriers.',
      });
    } else {
      recommendations.push({
        category: 'Overall',
        priority: 'HIGH',
        recommendation: 'Study faces significant feasibility challenges. Major modifications needed.',
      });
    }

    if (available < desired) {
      recommendations.push({
        category: 'Sample Size',
        priority: 'HIGH',
        recommendation: `Consider reducing target sample size to ${Math.floor(available * 0.8)} or expanding inclusion criteria.`,
      });
    }

    if (barriers.dataQuality.length > 0) {
      recommendations.push({
        category: 'Data Quality',
        priority: 'HIGH',
        recommendation: 'Implement strict data quality protocols and consider data validation procedures.',
      });
    }

    return recommendations;
  }

  private suggestMitigationStrategies(barriers: any): any {
    const strategies = [];

    if (barriers.recruitment.length > 0) {
      strategies.push({
        barrier: 'Recruitment challenges',
        strategies: [
          'Expand eligibility criteria if scientifically appropriate',
          'Include multiple recruitment sites',
          'Implement patient referral incentives',
          'Use registry-based recruitment',
        ],
      });
    }

    if (barriers.dataQuality.length > 0) {
      strategies.push({
        barrier: 'Data quality issues',
        strategies: [
          'Implement electronic data capture with validation rules',
          'Conduct training for data collectors',
          'Establish data quality monitoring procedures',
          'Consider prospective data collection for key variables',
        ],
      });
    }

    return strategies;
  }

  private estimateTimeline(
    desiredSize: number,
    available: number,
    duration: number,
    recruitmentRate?: number
  ): string {
    const rate = recruitmentRate || Math.floor(available / 24);
    const recruitmentMonths = Math.ceil(desiredSize / rate);
    const totalMonths = recruitmentMonths + 6; // Add 6 months for analysis

    if (totalMonths <= 12) return 'Less than 1 year';
    if (totalMonths <= 24) return '1-2 years';
    if (totalMonths <= 36) return '2-3 years';
    return 'More than 3 years';
  }

  private interpretFeasibilityScore(score: number): string {
    if (score >= 80) return 'Highly feasible - Excellent prospects for successful completion';
    if (score >= 60) return 'Feasible - Good prospects with some modifications';
    if (score >= 40) return 'Moderately feasible - Significant challenges need addressing';
    return 'Low feasibility - Major modifications required';
  }

  // Similar Studies Database

  async createSimilarStudy(userId: string, createDto: CreateSimilarStudyDto) {
    try {
      const study = await this.prisma.similarStudy.create({
        data: {
          ...createDto,
          createdBy: userId,
        },
      });

      this.logger.log(`Similar study created: ${study.title}`);
      return study;
    } catch (error) {
      this.logger.error('Error creating similar study', error);
      throw error;
    }
  }

  async searchSimilarStudies(searchDto: SearchSimilarStudiesDto) {
    try {
      const { page = 1, limit = 20 } = searchDto;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (searchDto.cancerType) {
        where.cancerType = { contains: searchDto.cancerType, mode: 'insensitive' };
      }

      if (searchDto.studyType) {
        where.studyType = searchDto.studyType;
      }

      if (searchDto.keywords) {
        where.OR = [
          { title: { contains: searchDto.keywords, mode: 'insensitive' } },
          { methodology: { contains: searchDto.keywords, mode: 'insensitive' } },
          { findings: { contains: searchDto.keywords, mode: 'insensitive' } },
        ];
      }

      if (searchDto.minSampleSize) {
        where.sampleSize = { gte: searchDto.minSampleSize };
      }

      if (searchDto.yearFrom || searchDto.yearTo) {
        where.year = {};
        if (searchDto.yearFrom) where.year.gte = searchDto.yearFrom;
        if (searchDto.yearTo) where.year.lte = searchDto.yearTo;
      }

      if (searchDto.tags && searchDto.tags.length > 0) {
        where.tags = { hasSome: searchDto.tags };
      }

      const [studies, total] = await Promise.all([
        this.prisma.similarStudy.findMany({
          where,
          skip,
          take: limit,
          orderBy: [
            { relevanceScore: 'desc' },
            { year: 'desc' },
          ],
        }),
        this.prisma.similarStudy.count({ where }),
      ]);

      return {
        studies,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Error searching similar studies', error);
      throw error;
    }
  }
}
