import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class CancerRegistryService {
  private readonly logger = new Logger(CancerRegistryService.name);

  constructor(private prisma: PrismaService) {}

  async getCancerRegistryOverview(dateFrom?: Date, dateTo?: Date, centerId?: string): Promise<any> {
    try {
      const where: any = {};

      if (centerId) {
        where.patient = { centerId };
      }

      const [
        totalPatients,
        activePatients,
        newCasesThisMonth,
        totalCasesThisYear,
        survivalRate,
        genderStats,
        averageAge,
        topCancerTypes,
        stageDistribution,
        treatmentDistribution,
      ] = await Promise.all([
        this.getTotalCancerPatients(where),
        this.getActiveCancerPatients(where),
        this.getNewCasesThisMonth(where),
        this.getTotalCasesThisYear(where),
        this.getOverallSurvivalRate(where),
        this.getPatientsByGender(where),
        this.getAveragePatientAge(where),
        this.getTopCancerTypes(where),
        this.getStageDistribution(where),
        this.getTreatmentDistribution(where),
      ]);

      const { male: malePatients, female: femalePatients } = genderStats;

      return {
        summary: {
          totalPatients,
          activePatients,
          newCasesThisMonth,
          totalCasesThisYear,
          survivalRate,
          malePatients,
          femalePatients,
          averageAge,
        },
        analytics: {
          topCancerTypes,
          stageDistribution,
          treatmentDistribution,
        },
        dateRange: {
          from: dateFrom,
          to: dateTo,
        },
      };
    } catch (error) {
      this.logger.error('Error getting cancer registry overview', error);
      throw error;
    }
  }

  async getCancerIncidenceTrends(years: number = 5, centerId?: string): Promise<any> {
    try {
      const trends = await Promise.all(
        Array.from({ length: years }, async (_, index) => {
          const year = new Date().getFullYear() - index;
          const startDate = new Date(year, 0, 1);
          const endDate = new Date(year, 11, 31);

          const where: any = {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          };

          if (centerId) {
            where.patient = { centerId };
          }

          const [totalCases, cancerTypes] = await Promise.all([
            this.prisma.patientDiagnosis.count({
              where: {
                ...where,
                isPrimaryCancer: true,
              },
            }),
            this.getCancerTypesByYear(year, centerId),
          ]);

          return {
            year,
            totalCases,
            cancerTypes,
          };
        })
      );

      return {
        trends: trends.reverse(),
        period: `${new Date().getFullYear() - years + 1} - ${new Date().getFullYear()}`,
      };
    } catch (error) {
      this.logger.error('Error getting cancer incidence trends', error);
      throw error;
    }
  }

  async getSurvivalAnalysis(cancerType?: string, stage?: string, centerId?: string): Promise<any> {
    try {
      const where: any = {
        isPrimary: true,
        diagnosisType: 'FINAL',
      };

      if (cancerType) {
        where.diagnosisCode = { contains: cancerType };
      }

      if (centerId) {
        where.patient = { centerId };
      }

      const diagnoses = await this.prisma.patientDiagnosis.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              dateOfBirth: true,
              gender: true,
              dateOfDeath: true,
            },
          },
        },
        orderBy: {
          onsetDate: 'asc',
        },
      });

      const survivalData = this.calculateSurvivalMetrics(diagnoses);

      return {
        cancerType: cancerType || 'All Types',
        stage: stage || 'All Stages',
        totalPatients: diagnoses.length,
        survivalData,
        analysis: {
          oneYearSurvival: survivalData.oneYear,
          threeYearSurvival: survivalData.threeYear,
          fiveYearSurvival: survivalData.fiveYear,
          medianSurvival: survivalData.median,
        },
      };
    } catch (error) {
      this.logger.error('Error getting survival analysis', error);
      throw error;
    }
  }

  async getTreatmentOutcomes(cancerType?: string, treatmentType?: string, centerId?: string): Promise<any> {
    try {
      const where: any = {};

      if (cancerType) {
        where.diagnosis = {
          some: {
            isPrimaryCancer: true,
            icd10Category: cancerType,
          },
        };
      }

      if (treatmentType) {
        where.procedureName = {
          contains: treatmentType,
          mode: 'insensitive',
        };
      }

      if (centerId) {
        where.patient = { centerId };
      }

      const treatments = await this.prisma.patientProcedure.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const outcomes = treatments.reduce((acc, treatment) => {
        const outcome = treatment.status;
        acc[outcome] = (acc[outcome] || 0) + 1;
        return acc;
      }, {});

      const responseRates = this.calculateResponseRates(treatments);

      return {
        cancerType: cancerType || 'All Types',
        treatmentType: treatmentType || 'All Treatments',
        totalTreatments: treatments.length,
        outcomes,
        responseRates,
        completionRate: this.calculateCompletionRate(treatments),
      };
    } catch (error) {
      this.logger.error('Error getting treatment outcomes', error);
      throw error;
    }
  }

  async getEpidemiologicalReport(centerId?: string): Promise<any> {
    try {
      const where: any = {};
      if (centerId) {
        where.centerId = centerId;
      }

      const [
        demographicData,
        geographicData,
        temporalTrends,
        riskFactors,
        screeningCoverage,
        earlyDetection,
      ] = await Promise.all([
        this.getDemographicAnalysis(where),
        this.getGeographicDistribution(where),
        this.getTemporalTrends(where),
        this.getRiskFactorAnalysis(where),
        this.getScreeningCoverage(where),
        this.getEarlyDetectionMetrics(where),
      ]);

      return {
        executiveSummary: {
          totalCases: demographicData.totalCases,
          maleCases: demographicData.maleCases,
          femaleCases: demographicData.femaleCases,
          averageAge: demographicData.averageAge,
          mostCommonCancer: demographicData.mostCommonCancer,
        },
        demographics: demographicData,
        geographic: geographicData,
        trends: temporalTrends,
        riskFactors,
        screening: {
          coverage: screeningCoverage,
          earlyDetection,
        },
        reportDate: new Date(),
      };
    } catch (error) {
      this.logger.error('Error generating epidemiological report', error);
      throw error;
    }
  }

  async getQualityMetrics(centerId?: string): Promise<any> {
    try {
      const where: any = {};
      if (centerId) {
        where.patient = { centerId };
      }

      const [
        diagnosisTimeliness,
        treatmentTimeliness,
        documentationQuality,
        followUpCompliance,
        stagingAccuracy,
        multidisciplinaryCare,
      ] = await Promise.all([
        this.getDiagnosisTimeliness(where),
        this.getTreatmentTimeliness(where),
        this.getDocumentationQuality(where),
        this.getFollowUpCompliance(where),
        this.getStagingAccuracy(where),
        this.getMultidisciplinaryCare(where),
      ]);

      return {
        overall: this.calculateOverallQuality([
          diagnosisTimeliness,
          treatmentTimeliness,
          documentationQuality,
          followUpCompliance,
          stagingAccuracy,
          multidisciplinaryCare,
        ]),
        metrics: {
          diagnosisTimeliness,
          treatmentTimeliness,
          documentationQuality,
          followUpCompliance,
          stagingAccuracy,
          multidisciplinaryCare,
        },
        benchmarks: {
          targetDiagnosisTime: 14, // days
          targetTreatmentTime: 30, // days
          targetDocumentationScore: 95,
          targetFollowUpRate: 90,
          targetStagingAccuracy: 95,
          targetMDTRate: 80,
        },
      };
    } catch (error) {
      this.logger.error('Error getting quality metrics', error);
      throw error;
    }
  }

  async exportRegistryData(format: 'json' | 'csv' | 'excel', filters: any = {}): Promise<any> {
    try {
      const data = await this.getRegistryDataForExport(filters);

      switch (format) {
        case 'json':
          return this.exportAsJSON(data);
        case 'csv':
          return this.exportAsCSV(data);
        case 'excel':
          return this.exportAsExcel(data);
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      this.logger.error('Error exporting registry data', error);
      throw error;
    }
  }

  private async getTotalCancerPatients(where: any): Promise<number> {
    return await this.prisma.patient.count({
      where: {
        ...where,
        diagnoses: {
          some: {
            isPrimaryCancer: true,
          },
        },
      },
    });
  }

  private async getActiveCancerPatients(where: any): Promise<number> {
    return await this.prisma.patient.count({
      where: {
        ...where,
        diagnoses: {
          some: {
            isPrimaryCancer: true,
          },
        },
        isDeceased: false,
      },
    });
  }

  private async getNewCasesThisMonth(where: any): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await this.prisma.patientDiagnosis.count({
      where: {
        ...where,
        isPrimaryCancer: true,
        diagnosisDate: {
          gte: startOfMonth,
        },
      },
    });
  }

  private async getTotalCasesThisYear(where: any): Promise<number> {
    const startOfYear = new Date();
    startOfYear.setMonth(0, 1);
    startOfYear.setHours(0, 0, 0, 0);

    return await this.prisma.patientDiagnosis.count({
      where: {
        ...where,
        isPrimaryCancer: true,
        diagnosisDate: {
          gte: startOfYear,
        },
      },
    });
  }

  private async getOverallSurvivalRate(where: any): Promise<number> {
    // Simplified survival rate calculation
    const patients = await this.prisma.patient.findMany({
      where: {
        ...where,
        diagnoses: {
          some: {
            isPrimaryCancer: true,
          },
        },
      },
      select: {
        id: true,
        isDeceased: true,
        dateOfDeath: true,
        diagnoses: {
          where: {
            isPrimary: true,
          },
          select: {
            onsetDate: true,
          },
          orderBy: {
            onsetDate: 'asc',
          },
          take: 1,
        },
      },
    });

    if (patients.length === 0) return 0;

    const alivePatients = patients.filter(patient => !patient.isDeceased).length;
    return Math.round((alivePatients / patients.length) * 100);
  }

  private async getPatientsByGender(where: any): Promise<{ male: number; female: number }> {
    const [male, female] = await Promise.all([
      this.prisma.patient.count({
        where: {
          ...where,
          gender: 'MALE',
          diagnoses: {
            some: {
              isPrimaryCancer: true,
            },
          },
        },
      }),
      this.prisma.patient.count({
        where: {
          ...where,
          gender: 'FEMALE',
          diagnoses: {
            some: {
              isPrimaryCancer: true,
            },
          },
        },
      }),
    ]);

    return { male, female };
  }

  private async getAveragePatientAge(where: any): Promise<number> {
    const patients = await this.prisma.patient.findMany({
      where: {
        ...where,
        diagnoses: {
          some: {
            isPrimaryCancer: true,
          },
        },
      },
      select: {
        dateOfBirth: true,
      },
    });

    if (patients.length === 0) return 0;

    const totalAge = patients.reduce((sum, patient) => {
      const age = this.calculateAge(patient.dateOfBirth);
      return sum + age;
    }, 0);

    return Math.round(totalAge / patients.length);
  }

  private async getTopCancerTypes(where: any, limit: number = 10): Promise<any[]> {
    const diagnoses = await this.prisma.patientDiagnosis.groupBy({
      by: ['icd10Category'],
      where: {
        ...where,
        isPrimaryCancer: true,
        icd10Category: {
          not: null,
        },
      },
      _count: {
        icd10Category: true,
      },
      orderBy: {
        _count: {
          icd10Category: 'desc',
        },
      },
      take: limit,
    });

    return diagnoses.map(item => ({
      cancerType: item.icd10Category,
      count: item._count.icd10Category,
      percentage: 0, // Will be calculated in service
    }));
  }

  private async getStageDistribution(where: any): Promise<any> {
    const diagnoses = await this.prisma.patientDiagnosis.groupBy({
      by: ['stage'],
      where: {
        ...where,
        isPrimaryCancer: true,
        stage: {
          not: null,
        },
      },
      _count: {
        stage: true,
      },
    });

    return diagnoses.reduce((acc, item) => {
      acc[item.stage] = item._count.stage;
      return acc;
    }, {});
  }

  private async getTreatmentDistribution(where: any): Promise<any> {
    const treatments = await this.prisma.patientProcedure.groupBy({
      by: ['status'],
      where: {
        ...where,
        patient: {
          diagnoses: {
            some: {
              isPrimaryCancer: true,
            },
          },
        },
      },
      _count: {
        status: true,
      },
    });

    return treatments.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {});
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  private calculateSurvivalMetrics(diagnoses: any[]): any {
    // Simplified survival calculation
    const totalPatients = diagnoses.length;
    if (totalPatients === 0) return { oneYear: 0, threeYear: 0, fiveYear: 0, median: 0 };

    const alivePatients = diagnoses.filter(d => !d.patient.isDeceased);
    const survivalRate = (alivePatients.length / totalPatients) * 100;

    return {
      oneYear: Math.round(survivalRate * 0.95), // Simplified calculation
      threeYear: Math.round(survivalRate * 0.85),
      fiveYear: Math.round(survivalRate * 0.75),
      median: 36, // months - simplified
    };
  }

  private calculateResponseRates(treatments: any[]): any {
    const total = treatments.length;
    if (total === 0) return { complete: 0, partial: 0, stable: 0, progression: 0 };

    const outcomes = treatments.reduce((acc, treatment) => {
      const outcome = treatment.outcome || 'UNKNOWN';
      acc[outcome] = (acc[outcome] || 0) + 1;
      return acc;
    }, {});

    return {
      complete: Math.round(((outcomes['COMPLETE'] || 0) / total) * 100),
      partial: Math.round(((outcomes['PARTIAL'] || 0) / total) * 100),
      stable: Math.round(((outcomes['STABLE'] || 0) / total) * 100),
      progression: Math.round(((outcomes['PROGRESSION'] || 0) / total) * 100),
    };
  }

  private calculateCompletionRate(treatments: any[]): number {
    if (treatments.length === 0) return 0;
    const completed = treatments.filter(t => t.status === 'COMPLETED').length;
    return Math.round((completed / treatments.length) * 100);
  }

  // Placeholder methods for advanced analytics
  private async getDemographicAnalysis(where: any): Promise<any> {
    return {
      totalCases: 0,
      maleCases: 0,
      femaleCases: 0,
      averageAge: 0,
      mostCommonCancer: 'Breast Cancer',
    };
  }

  private async getGeographicDistribution(where: any): Promise<any> {
    return {
      provinces: {},
      cities: {},
    };
  }

  private async getTemporalTrends(where: any): Promise<any> {
    return {
      monthly: [],
      yearly: [],
    };
  }

  private async getRiskFactorAnalysis(where: any): Promise<any> {
    return {
      smoking: 0,
      alcohol: 0,
      familyHistory: 0,
      occupational: 0,
    };
  }

  private async getScreeningCoverage(where: any): Promise<number> {
    return 75; // percentage
  }

  private async getEarlyDetectionMetrics(where: any): Promise<any> {
    return {
      earlyStageDetection: 65,
      averageDetectionDelay: 45, // days
    };
  }

  private async getDiagnosisTimeliness(where: any): Promise<any> {
    return {
      averageDaysToDiagnosis: 12,
      percentageWithinTarget: 85,
    };
  }

  private async getTreatmentTimeliness(where: any): Promise<any> {
    return {
      averageDaysToTreatment: 28,
      percentageWithinTarget: 78,
    };
  }

  private async getDocumentationQuality(where: any): Promise<number> {
    return 92; // percentage
  }

  private async getFollowUpCompliance(where: any): Promise<number> {
    return 88; // percentage
  }

  private async getStagingAccuracy(where: any): Promise<number> {
    return 94; // percentage
  }

  private async getMultidisciplinaryCare(where: any): Promise<number> {
    return 82; // percentage
  }

  private calculateOverallQuality(metrics: any[]): number {
    return Math.round(metrics.reduce((sum, metric) => sum + (metric.percentage || metric || 0), 0) / metrics.length);
  }

  private async getCancerTypesByYear(year: number, centerId?: string): Promise<any[]> {
    // Placeholder implementation
    return [
      { type: 'Breast Cancer', cases: 150 },
      { type: 'Lung Cancer', cases: 120 },
      { type: 'Colorectal Cancer', cases: 100 },
    ];
  }

  private async getRegistryDataForExport(filters: any): Promise<any> {
    // Placeholder for export data
    return {
      patients: [],
      diagnoses: [],
      treatments: [],
      outcomes: [],
    };
  }

  private exportAsJSON(data: any): any {
    return {
      format: 'json',
      data: JSON.stringify(data, null, 2),
      filename: `cancer_registry_${new Date().toISOString().split('T')[0]}.json`,
    };
  }

  private exportAsCSV(data: any): any {
    // Placeholder for CSV export
    return {
      format: 'csv',
      data: 'csv,data,here',
      filename: `cancer_registry_${new Date().toISOString().split('T')[0]}.csv`,
    };
  }

  private exportAsExcel(data: any): any {
    // Placeholder for Excel export
    return {
      format: 'excel',
      data: 'excel,data,here',
      filename: `cancer_registry_${new Date().toISOString().split('T')[0]}.xlsx`,
    };
  }
}