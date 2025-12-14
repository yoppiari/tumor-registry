import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get overall dashboard summary with key metrics
   */
  async getDashboardSummary() {
    try {
      const [
        totalPatients,
        activeTreatments,
        totalCenters,
        recentPatients,
        totalFollowUps,
        completedFollowUps,
        totalSurgeries,
        limbSalvageSurgeries,
      ] = await Promise.all([
        // Total patients
        this.prisma.patient.count({
          where: { isActive: true },
        }),

        // Active treatments
        this.prisma.treatmentManagement.count({
          where: { status: 'Ongoing' },
        }),

        // Total active centers
        this.prisma.center.count({
          where: { isActive: true },
        }),

        // Patients registered in last 30 days
        this.prisma.patient.count({
          where: {
            isActive: true,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        }),

        // Total follow-up visits
        this.prisma.followUpVisit.count(),

        // Completed follow-up visits
        this.prisma.followUpVisit.count({
          where: { status: 'completed' },
        }),

        // Total surgical records
        this.prisma.surgicalRecord.count(),

        // Limb salvage surgeries
        this.prisma.surgicalRecord.count({
          where: { surgeryType: 'LIMB_SALVAGE' },
        }),
      ]);

      const limbSalvageRate =
        totalSurgeries > 0
          ? ((limbSalvageSurgeries / totalSurgeries) * 100).toFixed(2)
          : '0.00';

      const followUpComplianceRate =
        totalFollowUps > 0
          ? ((completedFollowUps / totalFollowUps) * 100).toFixed(2)
          : '0.00';

      return {
        totalPatients,
        activeTreatments,
        totalCenters,
        recentPatients,
        limbSalvageRate: parseFloat(limbSalvageRate),
        followUpComplianceRate: parseFloat(followUpComplianceRate),
        totalFollowUps,
        completedFollowUps,
        totalSurgeries,
        limbSalvageSurgeries,
      };
    } catch (error) {
      this.logger.error('Error getting dashboard summary', error);
      throw error;
    }
  }

  /**
   * Calculate limb salvage vs amputation rates by center
   */
  async getLimbSalvageRateByCenter() {
    try {
      // Get all centers
      const centers = await this.prisma.center.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
          province: true,
        },
      });

      // Get surgical data for each center
      const centerStats = await Promise.all(
        centers.map(async (center) => {
          const surgeries = await this.prisma.surgicalRecord.findMany({
            where: {
              patient: {
                centerId: center.id,
              },
            },
            select: {
              surgeryType: true,
            },
          });

          const totalSurgeries = surgeries.length;
          const limbSalvage = surgeries.filter(
            (s) => s.surgeryType === 'LIMB_SALVAGE',
          ).length;
          const limbAblation = surgeries.filter(
            (s) => s.surgeryType === 'LIMB_ABLATION',
          ).length;

          const salvageRate =
            totalSurgeries > 0
              ? ((limbSalvage / totalSurgeries) * 100).toFixed(2)
              : '0.00';

          return {
            centerId: center.id,
            centerName: center.name,
            centerCode: center.code,
            province: center.province,
            totalSurgeries,
            limbSalvage,
            limbAblation,
            salvageRate: parseFloat(salvageRate),
          };
        }),
      );

      // Sort by salvage rate descending
      centerStats.sort((a, b) => b.salvageRate - a.salvageRate);

      return {
        centers: centerStats,
        overallStats: {
          totalSurgeries: centerStats.reduce(
            (sum, c) => sum + c.totalSurgeries,
            0,
          ),
          totalLimbSalvage: centerStats.reduce(
            (sum, c) => sum + c.limbSalvage,
            0,
          ),
          totalLimbAblation: centerStats.reduce(
            (sum, c) => sum + c.limbAblation,
            0,
          ),
          averageSalvageRate:
            centerStats.length > 0
              ? (
                  centerStats.reduce((sum, c) => sum + c.salvageRate, 0) /
                  centerStats.length
                ).toFixed(2)
              : '0.00',
        },
      };
    } catch (error) {
      this.logger.error('Error getting limb salvage rate by center', error);
      throw error;
    }
  }

  /**
   * Get MSTS score trends over time
   */
  async getMstsTrends(months: number = 12) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const mstsScores = await this.prisma.mstsScore.findMany({
        where: {
          assessmentDate: {
            gte: startDate,
          },
        },
        select: {
          totalScore: true,
          pain: true,
          function: true,
          emotionalAcceptance: true,
          supports: true,
          walking: true,
          gait: true,
          assessmentDate: true,
          patient: {
            select: {
              id: true,
              pathologyType: true,
              ennekingStage: true,
            },
          },
        },
        orderBy: {
          assessmentDate: 'asc',
        },
      });

      // Group by month
      const monthlyData: Record<
        string,
        {
          count: number;
          totalScore: number;
          pain: number;
          function: number;
          emotionalAcceptance: number;
          supports: number;
          walking: number;
          gait: number;
        }
      > = {};

      mstsScores.forEach((score) => {
        const monthKey = `${score.assessmentDate.getFullYear()}-${String(score.assessmentDate.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            count: 0,
            totalScore: 0,
            pain: 0,
            function: 0,
            emotionalAcceptance: 0,
            supports: 0,
            walking: 0,
            gait: 0,
          };
        }

        monthlyData[monthKey].count++;
        monthlyData[monthKey].totalScore += score.totalScore;
        monthlyData[monthKey].pain += score.pain;
        monthlyData[monthKey].function += score.function;
        monthlyData[monthKey].emotionalAcceptance += score.emotionalAcceptance;
        monthlyData[monthKey].supports += score.supports;
        monthlyData[monthKey].walking += score.walking;
        monthlyData[monthKey].gait += score.gait;
      });

      // Calculate averages
      const trends = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        averageTotalScore: parseFloat(
          (data.totalScore / data.count).toFixed(2),
        ),
        averagePain: parseFloat((data.pain / data.count).toFixed(2)),
        averageFunction: parseFloat((data.function / data.count).toFixed(2)),
        averageEmotionalAcceptance: parseFloat(
          (data.emotionalAcceptance / data.count).toFixed(2),
        ),
        averageSupports: parseFloat((data.supports / data.count).toFixed(2)),
        averageWalking: parseFloat((data.walking / data.count).toFixed(2)),
        averageGait: parseFloat((data.gait / data.count).toFixed(2)),
        assessmentCount: data.count,
      }));

      return {
        period: `${months} months`,
        trends,
        totalAssessments: mstsScores.length,
        overallAverage:
          mstsScores.length > 0
            ? parseFloat(
                (
                  mstsScores.reduce((sum, s) => sum + s.totalScore, 0) /
                  mstsScores.length
                ).toFixed(2),
              )
            : 0,
      };
    } catch (error) {
      this.logger.error('Error getting MSTS trends', error);
      throw error;
    }
  }

  /**
   * Treatment outcome analysis by modality
   */
  async getTreatmentEffectiveness() {
    try {
      const treatments = await this.prisma.treatmentManagement.findMany({
        select: {
          treatmentType: true,
          status: true,
          response: true,
          surgeryType: true,
          surgicalMargin: true,
          huvosGrade: true,
          patient: {
            select: {
              id: true,
              pathologyType: true,
              ennekingStage: true,
              isDeceased: true,
            },
          },
        },
      });

      // Group by treatment type
      const treatmentStats: Record<
        string,
        {
          total: number;
          completed: number;
          completeResponse: number;
          partialResponse: number;
          stableDisease: number;
          progressiveDisease: number;
        }
      > = {};

      treatments.forEach((treatment) => {
        const type = treatment.treatmentType;
        if (!treatmentStats[type]) {
          treatmentStats[type] = {
            total: 0,
            completed: 0,
            completeResponse: 0,
            partialResponse: 0,
            stableDisease: 0,
            progressiveDisease: 0,
          };
        }

        treatmentStats[type].total++;
        if (treatment.status === 'Completed') {
          treatmentStats[type].completed++;
        }

        if (treatment.response === 'Complete') {
          treatmentStats[type].completeResponse++;
        } else if (treatment.response === 'Partial') {
          treatmentStats[type].partialResponse++;
        } else if (treatment.response === 'Stable') {
          treatmentStats[type].stableDisease++;
        } else if (treatment.response === 'Progressive') {
          treatmentStats[type].progressiveDisease++;
        }
      });

      // Calculate effectiveness rates
      const effectiveness = Object.entries(treatmentStats).map(
        ([type, stats]) => ({
          treatmentType: type,
          totalCases: stats.total,
          completedCases: stats.completed,
          completionRate:
            stats.total > 0
              ? parseFloat(((stats.completed / stats.total) * 100).toFixed(2))
              : 0,
          completeResponse: stats.completeResponse,
          partialResponse: stats.partialResponse,
          stableDisease: stats.stableDisease,
          progressiveDisease: stats.progressiveDisease,
          responseRate:
            stats.total > 0
              ? parseFloat(
                  (
                    ((stats.completeResponse + stats.partialResponse) /
                      stats.total) *
                    100
                  ).toFixed(2),
                )
              : 0,
        }),
      );

      // Sort by response rate
      effectiveness.sort((a, b) => b.responseRate - a.responseRate);

      return {
        treatmentModalities: effectiveness,
        totalTreatments: treatments.length,
      };
    } catch (error) {
      this.logger.error('Error getting treatment effectiveness', error);
      throw error;
    }
  }

  /**
   * WHO classification distribution breakdown
   */
  async getWhoClassificationDistribution() {
    try {
      // Get bone tumor distribution
      const boneTumorPatients = await this.prisma.patient.findMany({
        where: {
          pathologyType: 'bone_tumor',
          whoBoneTumorId: { not: null },
        },
        select: {
          whoBoneTumor: {
            select: {
              id: true,
              category: true,
              subcategory: true,
              diagnosis: true,
              isMalignant: true,
            },
          },
          ennekingStage: true,
        },
      });

      // Get soft tissue tumor distribution
      const softTissueTumorPatients = await this.prisma.patient.findMany({
        where: {
          pathologyType: 'soft_tissue_tumor',
          whoSoftTissueTumorId: { not: null },
        },
        select: {
          whoSoftTissueTumor: {
            select: {
              id: true,
              category: true,
              subcategory: true,
              diagnosis: true,
              isMalignant: true,
            },
          },
          ennekingStage: true,
        },
      });

      // Aggregate bone tumors
      const boneTumorCounts: Record<string, number> = {};
      boneTumorPatients.forEach((p) => {
        if (p.whoBoneTumor) {
          const key = p.whoBoneTumor.diagnosis;
          boneTumorCounts[key] = (boneTumorCounts[key] || 0) + 1;
        }
      });

      // Aggregate soft tissue tumors
      const softTissueTumorCounts: Record<string, number> = {};
      softTissueTumorPatients.forEach((p) => {
        if (p.whoSoftTissueTumor) {
          const key = p.whoSoftTissueTumor.diagnosis;
          softTissueTumorCounts[key] = (softTissueTumorCounts[key] || 0) + 1;
        }
      });

      const boneTumorDistribution = Object.entries(boneTumorCounts)
        .map(([diagnosis, count]) => ({
          diagnosis,
          count,
          percentage: parseFloat(
            ((count / boneTumorPatients.length) * 100).toFixed(2),
          ),
        }))
        .sort((a, b) => b.count - a.count);

      const softTissueTumorDistribution = Object.entries(
        softTissueTumorCounts,
      )
        .map(([diagnosis, count]) => ({
          diagnosis,
          count,
          percentage: parseFloat(
            ((count / softTissueTumorPatients.length) * 100).toFixed(2),
          ),
        }))
        .sort((a, b) => b.count - a.count);

      return {
        boneTumors: {
          total: boneTumorPatients.length,
          distribution: boneTumorDistribution,
        },
        softTissueTumors: {
          total: softTissueTumorPatients.length,
          distribution: softTissueTumorDistribution,
        },
        combined: {
          total: boneTumorPatients.length + softTissueTumorPatients.length,
          boneTumorsPercentage:
            boneTumorPatients.length + softTissueTumorPatients.length > 0
              ? parseFloat(
                  (
                    (boneTumorPatients.length /
                      (boneTumorPatients.length +
                        softTissueTumorPatients.length)) *
                    100
                  ).toFixed(2),
                )
              : 0,
          softTissueTumorsPercentage:
            boneTumorPatients.length + softTissueTumorPatients.length > 0
              ? parseFloat(
                  (
                    (softTissueTumorPatients.length /
                      (boneTumorPatients.length +
                        softTissueTumorPatients.length)) *
                    100
                  ).toFixed(2),
                )
              : 0,
        },
      };
    } catch (error) {
      this.logger.error('Error getting WHO classification distribution', error);
      throw error;
    }
  }

  /**
   * 5-year survival analysis by Enneking staging
   */
  async getSurvivalAnalysisByTumorType() {
    try {
      // Get patients with at least 5 years of history
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

      const patients = await this.prisma.patient.findMany({
        where: {
          createdAt: {
            lte: fiveYearsAgo,
          },
        },
        select: {
          id: true,
          ennekingStage: true,
          pathologyType: true,
          isDeceased: true,
          dateOfDeath: true,
          createdAt: true,
        },
      });

      // Group by Enneking stage
      const stageStats: Record<
        string,
        { total: number; survived: number; deceased: number }
      > = {};

      patients.forEach((patient) => {
        const stage = patient.ennekingStage || 'Unknown';
        if (!stageStats[stage]) {
          stageStats[stage] = { total: 0, survived: 0, deceased: 0 };
        }

        stageStats[stage].total++;
        if (patient.isDeceased) {
          stageStats[stage].deceased++;
        } else {
          stageStats[stage].survived++;
        }
      });

      const survivalByStage = Object.entries(stageStats).map(
        ([stage, stats]) => ({
          ennekingStage: stage,
          totalPatients: stats.total,
          survived: stats.survived,
          deceased: stats.deceased,
          survivalRate:
            stats.total > 0
              ? parseFloat(((stats.survived / stats.total) * 100).toFixed(2))
              : 0,
          mortalityRate:
            stats.total > 0
              ? parseFloat(((stats.deceased / stats.total) * 100).toFixed(2))
              : 0,
        }),
      );

      // Sort by stage
      const stageOrder = ['IA', 'IB', 'IIA', 'IIB', 'III', 'Unknown'];
      survivalByStage.sort(
        (a, b) =>
          stageOrder.indexOf(a.ennekingStage) -
          stageOrder.indexOf(b.ennekingStage),
      );

      return {
        period: '5 years',
        totalPatients: patients.length,
        overallSurvivalRate:
          patients.length > 0
            ? parseFloat(
                (
                  (patients.filter((p) => !p.isDeceased).length /
                    patients.length) *
                  100
                ).toFixed(2),
              )
            : 0,
        byEnnekingStage: survivalByStage,
      };
    } catch (error) {
      this.logger.error('Error getting survival analysis', error);
      throw error;
    }
  }

  /**
   * Center performance comparison
   */
  async getCenterPerformanceComparison() {
    try {
      const centers = await this.prisma.center.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
          province: true,
        },
      });

      const centerPerformance = await Promise.all(
        centers.map(async (center) => {
          const [
            totalPatients,
            surgeries,
            followUps,
            completedFollowUps,
            avgMstsScore,
          ] = await Promise.all([
            // Total patients
            this.prisma.patient.count({
              where: { centerId: center.id, isActive: true },
            }),

            // Surgeries
            this.prisma.surgicalRecord.findMany({
              where: {
                patient: {
                  centerId: center.id,
                },
              },
              select: {
                surgeryType: true,
                surgicalMargin: true,
              },
            }),

            // Total follow-ups scheduled
            this.prisma.followUpVisit.count({
              where: {
                patient: {
                  centerId: center.id,
                },
              },
            }),

            // Completed follow-ups
            this.prisma.followUpVisit.count({
              where: {
                patient: {
                  centerId: center.id,
                },
                status: 'completed',
              },
            }),

            // Average MSTS score
            this.prisma.mstsScore.aggregate({
              where: {
                patient: {
                  centerId: center.id,
                },
              },
              _avg: {
                totalScore: true,
              },
            }),
          ]);

          const limbSalvage = surgeries.filter(
            (s) => s.surgeryType === 'LIMB_SALVAGE',
          ).length;
          const wideMargins = surgeries.filter(
            (s) => s.surgicalMargin && s.surgicalMargin.includes('Wide'),
          ).length;

          return {
            centerId: center.id,
            centerName: center.name,
            centerCode: center.code,
            province: center.province,
            totalPatients,
            totalSurgeries: surgeries.length,
            limbSalvageRate:
              surgeries.length > 0
                ? parseFloat(
                    ((limbSalvage / surgeries.length) * 100).toFixed(2),
                  )
                : 0,
            wideMarginRate:
              surgeries.length > 0
                ? parseFloat(((wideMargins / surgeries.length) * 100).toFixed(2))
                : 0,
            followUpComplianceRate:
              followUps > 0
                ? parseFloat(((completedFollowUps / followUps) * 100).toFixed(2))
                : 0,
            averageMstsScore: avgMstsScore._avg.totalScore
              ? parseFloat(avgMstsScore._avg.totalScore.toFixed(2))
              : 0,
          };
        }),
      );

      // Sort by total patients descending
      centerPerformance.sort((a, b) => b.totalPatients - a.totalPatients);

      return {
        centers: centerPerformance,
        nationalAverages: {
          limbSalvageRate:
            centerPerformance.length > 0
              ? parseFloat(
                  (
                    centerPerformance.reduce(
                      (sum, c) => sum + c.limbSalvageRate,
                      0,
                    ) / centerPerformance.length
                  ).toFixed(2),
                )
              : 0,
          wideMarginRate:
            centerPerformance.length > 0
              ? parseFloat(
                  (
                    centerPerformance.reduce(
                      (sum, c) => sum + c.wideMarginRate,
                      0,
                    ) / centerPerformance.length
                  ).toFixed(2),
                )
              : 0,
          followUpComplianceRate:
            centerPerformance.length > 0
              ? parseFloat(
                  (
                    centerPerformance.reduce(
                      (sum, c) => sum + c.followUpComplianceRate,
                      0,
                    ) / centerPerformance.length
                  ).toFixed(2),
                )
              : 0,
          averageMstsScore:
            centerPerformance.length > 0
              ? parseFloat(
                  (
                    centerPerformance.reduce(
                      (sum, c) => sum + c.averageMstsScore,
                      0,
                    ) / centerPerformance.length
                  ).toFixed(2),
                )
              : 0,
        },
      };
    } catch (error) {
      this.logger.error('Error getting center performance comparison', error);
      throw error;
    }
  }

  /**
   * Follow-up visit compliance tracking
   */
  async getFollowUpCompliance(centerId?: string) {
    try {
      const whereClause: any = {};
      if (centerId) {
        whereClause.patient = { centerId };
      }

      const [totalScheduled, completedVisits, missedVisits, upcomingVisits] =
        await Promise.all([
          // Total scheduled visits
          this.prisma.followUpVisit.count({
            where: whereClause,
          }),

          // Completed visits
          this.prisma.followUpVisit.count({
            where: {
              ...whereClause,
              status: 'completed',
            },
          }),

          // Missed visits
          this.prisma.followUpVisit.count({
            where: {
              ...whereClause,
              status: 'missed',
            },
          }),

          // Upcoming visits (scheduled in future)
          this.prisma.followUpVisit.count({
            where: {
              ...whereClause,
              status: 'scheduled',
              scheduledDate: {
                gte: new Date(),
              },
            },
          }),
        ]);

      // Get compliance by visit number (1-14)
      const visitCompliance = await Promise.all(
        Array.from({ length: 14 }, (_, i) => i + 1).map(async (visitNumber) => {
          const total = await this.prisma.followUpVisit.count({
            where: {
              ...whereClause,
              visitNumber,
            },
          });

          const completed = await this.prisma.followUpVisit.count({
            where: {
              ...whereClause,
              visitNumber,
              status: 'completed',
            },
          });

          return {
            visitNumber,
            totalScheduled: total,
            completed,
            complianceRate:
              total > 0
                ? parseFloat(((completed / total) * 100).toFixed(2))
                : 0,
          };
        }),
      );

      const overallComplianceRate =
        totalScheduled > 0
          ? parseFloat(((completedVisits / totalScheduled) * 100).toFixed(2))
          : 0;

      const missedRate =
        totalScheduled > 0
          ? parseFloat(((missedVisits / totalScheduled) * 100).toFixed(2))
          : 0;

      return {
        centerId: centerId || 'all',
        overallStats: {
          totalScheduled,
          completedVisits,
          missedVisits,
          upcomingVisits,
          overallComplianceRate,
          missedRate,
        },
        byVisitNumber: visitCompliance,
      };
    } catch (error) {
      this.logger.error('Error getting follow-up compliance', error);
      throw error;
    }
  }

  // Legacy method aliases for backward compatibility
  async getCenterPerformance() {
    return this.getCenterPerformanceComparison();
  }

  async getTreatmentOutcomes() {
    return this.getTreatmentEffectiveness();
  }

  async getTumorDistribution() {
    return this.getWhoClassificationDistribution();
  }

  async getPatientDataQuality() {
    try {
      const totalPatients = await this.prisma.patient.count();

      const patientsWithCompleteData = await this.prisma.patient.count({
        where: {
          AND: [
            { pathologyType: { not: null } },
            { ennekingStage: { not: null } },
            {
              OR: [
                { whoBoneTumorId: { not: null } },
                { whoSoftTissueTumorId: { not: null } },
              ],
            },
          ],
        },
      });

      const dataQualityRate =
        totalPatients > 0
          ? parseFloat(
              ((patientsWithCompleteData / totalPatients) * 100).toFixed(2),
            )
          : 0;

      return {
        totalPatients,
        patientsWithCompleteData,
        dataQualityRate,
        patientsWithIncompleteData: totalPatients - patientsWithCompleteData,
      };
    } catch (error) {
      this.logger.error('Error getting patient data quality', error);
      throw error;
    }
  }

}
