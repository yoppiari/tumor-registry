import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { RedisService } from '../analytics/redis.service';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/create-publication.dto';
import {
  CreateCitationDto,
  BulkCitationImportDto,
  CitationAnalysisDto,
} from './dto/create-citation.dto';
import {
  CreateImpactMetricDto,
  ResearcherContributionDto,
  CollaborationNetworkDto,
  InnovationTrackingDto,
  ROIAnalysisDto,
  ImpactReportDto,
  BiblometricIndicatorsDto,
} from './dto/research-impact.dto';

@Injectable()
export class ResearchImpactService {
  private readonly logger = new Logger(ResearchImpactService.name);
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  // ========== PUBLICATION MANAGEMENT ==========

  async createPublication(dto: CreatePublicationDto, userId: string) {
    try {
      // Verify research request exists
      const research = await this.prisma.researchRequest.findUnique({
        where: { id: dto.researchRequestId },
      });

      if (!research) {
        throw new NotFoundException('Research request not found');
      }

      const publication = await this.prisma.researchPublication.create({
        data: {
          ...dto,
          publicationDate: dto.publicationDate
            ? new Date(dto.publicationDate)
            : null,
          createdBy: userId,
        },
        include: {
          researchRequest: {
            select: {
              id: true,
              title: true,
              principalInvestigator: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      });

      this.logger.log(`Publication created: ${publication.title}`);
      await this.invalidateImpactCache(dto.researchRequestId);

      return publication;
    } catch (error) {
      this.logger.error('Error creating publication', error);
      throw error;
    }
  }

  async updatePublication(
    id: string,
    dto: UpdatePublicationDto,
    userId: string,
  ) {
    try {
      const existing = await this.prisma.researchPublication.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Publication not found');
      }

      const updated = await this.prisma.researchPublication.update({
        where: { id },
        data: {
          ...dto,
          publicationDate: dto.publicationDate
            ? new Date(dto.publicationDate)
            : undefined,
        },
        include: {
          citations: true,
          researchRequest: {
            select: { id: true, title: true },
          },
        },
      });

      await this.invalidateImpactCache(existing.researchRequestId);
      this.logger.log(`Publication updated: ${updated.title}`);

      return updated;
    } catch (error) {
      this.logger.error('Error updating publication', error);
      throw error;
    }
  }

  async getPublication(id: string) {
    const publication = await this.prisma.researchPublication.findUnique({
      where: { id },
      include: {
        citations: {
          orderBy: { citationDate: 'desc' },
        },
        researchRequest: {
          select: {
            id: true,
            title: true,
            principalInvestigator: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    return publication;
  }

  async getPublicationsByResearch(researchRequestId: string) {
    return await this.prisma.researchPublication.findMany({
      where: { researchRequestId },
      include: {
        citations: {
          select: {
            id: true,
            citingTitle: true,
            citationDate: true,
            source: true,
          },
        },
      },
      orderBy: { publicationDate: 'desc' },
    });
  }

  async deletePublication(id: string) {
    const publication = await this.prisma.researchPublication.findUnique({
      where: { id },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    await this.prisma.researchPublication.delete({ where: { id } });
    await this.invalidateImpactCache(publication.researchRequestId);

    this.logger.log(`Publication deleted: ${id}`);
    return { message: 'Publication deleted successfully' };
  }

  // ========== CITATION TRACKING ==========

  async createCitation(dto: CreateCitationDto, userId: string) {
    try {
      const publication = await this.prisma.researchPublication.findUnique({
        where: { id: dto.publicationId },
      });

      if (!publication) {
        throw new NotFoundException('Publication not found');
      }

      const citation = await this.prisma.researchCitation.create({
        data: {
          ...dto,
          citationDate: dto.citationDate ? new Date(dto.citationDate) : null,
        },
      });

      // Update citation count on publication
      await this.prisma.researchPublication.update({
        where: { id: dto.publicationId },
        data: {
          citationCount: {
            increment: 1,
          },
        },
      });

      await this.invalidateImpactCache(publication.researchRequestId);
      this.logger.log(`Citation added to publication: ${dto.publicationId}`);

      return citation;
    } catch (error) {
      this.logger.error('Error creating citation', error);
      throw error;
    }
  }

  async getCitationsForPublication(publicationId: string) {
    return await this.prisma.researchCitation.findMany({
      where: { publicationId },
      orderBy: { citationDate: 'desc' },
    });
  }

  async analyzeCitations(dto: CitationAnalysisDto) {
    const cacheKey = `citation-analysis:${dto.publicationId}`;
    const cached = await this.redisService.get<any>(cacheKey);

    if (cached) {
      return cached;
    }

    const publication = await this.prisma.researchPublication.findUnique({
      where: { id: dto.publicationId },
      include: {
        citations: {
          where: {
            ...(dto.startDate && {
              citationDate: { gte: new Date(dto.startDate) },
            }),
            ...(dto.endDate && {
              citationDate: { lte: new Date(dto.endDate) },
            }),
          },
          orderBy: { citationDate: 'asc' },
        },
      },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found');
    }

    const analysis = {
      publicationId: dto.publicationId,
      totalCitations: publication.citations.length,
      citationsByYear: this.groupCitationsByYear(publication.citations),
      citationsBySource: this.groupCitationsBySource(publication.citations),
      citationsByType: this.groupCitationsByType(publication.citations),
      averageCitationsPerYear: this.calculateAverageCitationsPerYear(
        publication.citations,
        publication.publicationDate,
      ),
      citationTrend: dto.includeTrends
        ? this.calculateCitationTrend(publication.citations)
        : null,
      h5Index: this.calculateH5Index(publication.citations),
      peakCitationYear: this.findPeakCitationYear(publication.citations),
      recentCitations: publication.citations.slice(-10).reverse(),
    };

    await this.redisService.set(cacheKey, analysis, this.CACHE_TTL);

    return analysis;
  }

  // ========== BIBLIOMETRIC INDICATORS ==========

  async calculateBibliometricIndicators(dto: BiblometricIndicatorsDto) {
    const cacheKey = `bibliometric:${dto.researcherId}:${dto.timePeriod || 'all'}`;
    const cached = await this.redisService.get<any>(cacheKey);

    if (cached) {
      return cached;
    }

    // Get all publications by researcher
    const publications = await this.prisma.researchPublication.findMany({
      where: {
        researchRequest: {
          OR: [
            { principalInvestigatorId: dto.researcherId },
            { createdBy: dto.researcherId },
          ],
        },
      },
      include: {
        citations: true,
      },
      orderBy: { publicationDate: 'desc' },
    });

    const indicators: any = {
      totalPublications: publications.length,
      totalCitations: publications.reduce(
        (sum, p) => sum + p.citationCount,
        0,
      ),
    };

    if (dto.includeHIndex) {
      indicators.hIndex = this.calculateHIndex(publications);
    }

    if (dto.includeI10Index) {
      indicators.i10Index = this.calculateI10Index(publications);
    }

    if (dto.includeGIndex) {
      indicators.gIndex = this.calculateGIndex(publications);
    }

    indicators.citationsPerPublication =
      publications.length > 0
        ? (indicators.totalCitations / publications.length).toFixed(2)
        : 0;

    indicators.publicationsByYear = this.groupPublicationsByYear(publications);

    await this.redisService.set(cacheKey, indicators, this.CACHE_TTL * 2);

    return indicators;
  }

  // ========== RESEARCHER CONTRIBUTIONS ==========

  async getResearcherContributions(dto: ResearcherContributionDto) {
    const cacheKey = `researcher-contributions:${dto.researcherId}`;
    const cached = await this.redisService.get<any>(cacheKey);

    if (cached && !dto.includeDetails) {
      return cached;
    }

    const timePeriod = dto.timePeriod || '1y';
    const startDate = this.getStartDateFromPeriod(timePeriod);

    const contributions = await this.prisma.researcherContribution.findMany({
      where: {
        researcherId: dto.researcherId,
        startDate: { gte: startDate },
      },
      include: dto.includeDetails
        ? {
            researchRequest: {
              select: {
                id: true,
                title: true,
                status: true,
              },
            },
          }
        : undefined,
      orderBy: { startDate: 'desc' },
    });

    const summary = {
      totalContributions: contributions.length,
      publicationCount: contributions.reduce(
        (sum, c) => sum + c.publicationCount,
        0,
      ),
      citationCount: contributions.reduce((sum, c) => sum + c.citationCount, 0),
      averageHIndex:
        contributions.filter((c) => c.hIndex).length > 0
          ? (
              contributions.reduce((sum, c) => sum + (c.hIndex || 0), 0) /
              contributions.filter((c) => c.hIndex).length
            ).toFixed(2)
          : 0,
      totalImpactScore: contributions
        .reduce((sum, c) => sum + (c.totalImpactScore || 0), 0)
        .toFixed(2),
      contributionsByType: this.groupByContributionType(contributions),
      contributionsByLevel: this.groupByContributionLevel(contributions),
      contributions: dto.includeDetails ? contributions : undefined,
    };

    if (!dto.includeDetails) {
      await this.redisService.set(cacheKey, summary, this.CACHE_TTL);
    }

    return summary;
  }

  async createResearcherLeaderboard(limit: number = 20) {
    const cacheKey = `researcher-leaderboard:${limit}`;
    const cached = await this.redisService.get<any>(cacheKey);

    if (cached) {
      return cached;
    }

    // Get top researchers by impact metrics
    const leaderboard = await this.prisma.$queryRaw`
      SELECT
        u.id,
        u.name,
        u.email,
        COUNT(DISTINCT rp.id) as publication_count,
        SUM(rp."citationCount") as total_citations,
        COUNT(DISTINCT rr.id) as research_count,
        AVG(rc."totalImpactScore") as avg_impact_score
      FROM system.users u
      LEFT JOIN medical.research_requests rr ON u.id = rr."principalInvestigatorId"
      LEFT JOIN medical.research_publications rp ON rr.id = rp."researchRequestId"
      LEFT JOIN medical.researcher_contributions rc ON u.id = rc."researcherId"
      WHERE u."isActive" = true
      GROUP BY u.id, u.name, u.email
      HAVING COUNT(DISTINCT rp.id) > 0
      ORDER BY total_citations DESC, publication_count DESC
      LIMIT ${limit}
    `;

    const result = {
      leaderboard,
      generatedAt: new Date(),
      totalResearchers: Array.isArray(leaderboard) ? leaderboard.length : 0,
    };

    await this.redisService.set(cacheKey, result, this.CACHE_TTL * 4);

    return result;
  }

  // ========== COLLABORATION NETWORK ==========

  async getCollaborationNetwork(dto: CollaborationNetworkDto) {
    const cacheKey = `collaboration-network:${dto.researchRequestId || dto.centerId}`;
    const cached = await this.redisService.get<any>(cacheKey);

    if (cached) {
      return cached;
    }

    let collaborations;

    if (dto.researchRequestId) {
      collaborations = await this.prisma.researchCollaboration.findMany({
        where: { researchRequestId: dto.researchRequestId },
        include: {
          collaborator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          researchRequest: {
            select: {
              id: true,
              title: true,
              principalInvestigator: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });
    } else {
      // Get all collaborations for a center or overall
      collaborations = await this.prisma.researchCollaboration.findMany({
        include: {
          collaborator: {
            select: {
              id: true,
              name: true,
              email: true,
              ...(dto.centerId && { centerId: true }),
            },
          },
          researchRequest: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
    }

    const network = this.buildCollaborationNetwork(
      collaborations,
      dto.maxDepth || 2,
      dto.minStrength || 0.1,
    );

    await this.redisService.set(cacheKey, network, this.CACHE_TTL * 2);

    return network;
  }

  // ========== INNOVATION TRACKING ==========

  async trackInnovation(dto: InnovationTrackingDto, userId: string) {
    try {
      const research = await this.prisma.researchRequest.findUnique({
        where: { id: dto.researchRequestId },
      });

      if (!research) {
        throw new NotFoundException('Research request not found');
      }

      const innovation = await this.prisma.researchInnovation.create({
        data: {
          researchRequestId: dto.researchRequestId,
          innovationType: dto.innovationType as any,
          title: dto.title,
          description: dto.description,
          applicationNumber: dto.applicationNumber,
          status: dto.status as any,
          filingDate: dto.date ? new Date(dto.date) : null,
          organizations: dto.organizations,
          expectedImpact: dto.impact,
          createdBy: userId,
        },
      });

      await this.invalidateImpactCache(dto.researchRequestId);
      this.logger.log(`Innovation tracked: ${innovation.title}`);

      return innovation;
    } catch (error) {
      this.logger.error('Error tracking innovation', error);
      throw error;
    }
  }

  async getInnovationsByResearch(researchRequestId: string) {
    return await this.prisma.researchInnovation.findMany({
      where: { researchRequestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ========== ROI ANALYSIS ==========

  async analyzeROI(dto: ROIAnalysisDto) {
    const cacheKey = `roi-analysis:${dto.researchRequestId}`;
    const cached = await this.redisService.get<any>(cacheKey);

    if (cached) {
      return cached;
    }

    const research = await this.prisma.researchRequest.findUnique({
      where: { id: dto.researchRequestId },
      include: {
        publications: true,
        innovations: true,
        outcomes: true,
        impactMetrics: true,
      },
    });

    if (!research) {
      throw new NotFoundException('Research request not found');
    }

    const fundingAmount = dto.fundingAmount || 0;
    const timePeriod = dto.timePeriod || 5;

    const analysis: any = {
      researchId: dto.researchRequestId,
      fundingAmount,
      timePeriod,
      publications: research.publications.length,
      citations: research.publications.reduce(
        (sum, p) => sum + p.citationCount,
        0,
      ),
      innovations: research.innovations.length,
      outcomes: research.outcomes.length,
    };

    if (dto.includeEconomicImpact) {
      analysis.economicImpact = this.calculateEconomicImpact(research);
    }

    if (dto.includeSocialImpact) {
      analysis.socialImpact = this.calculateSocialImpact(research);
    }

    if (dto.includeAcademicImpact) {
      analysis.academicImpact = this.calculateAcademicImpact(research);
    }

    // Calculate ROI ratio
    const totalValue =
      (analysis.economicImpact?.estimatedValue || 0) +
      (analysis.socialImpact?.estimatedValue || 0) +
      (analysis.academicImpact?.estimatedValue || 0);

    analysis.roiRatio =
      fundingAmount > 0 ? (totalValue / fundingAmount).toFixed(2) : 0;
    analysis.roiPercentage =
      fundingAmount > 0
        ? (((totalValue - fundingAmount) / fundingAmount) * 100).toFixed(2)
        : 0;

    await this.redisService.set(cacheKey, analysis, this.CACHE_TTL * 6);

    return analysis;
  }

  // ========== IMPACT REPORTING ==========

  async generateImpactReport(dto: ImpactReportDto) {
    const format = dto.format || 'summary';
    let report: any = {
      generatedAt: new Date(),
      format,
      stakeholderType: dto.stakeholderType,
    };

    if (dto.researchRequestId) {
      // Single research impact report
      report = await this.generateSingleResearchReport(
        dto.researchRequestId,
        format,
      );
    } else {
      // Overall impact report
      report = await this.generateOverallImpactReport(
        dto.startDate,
        dto.endDate,
        format,
      );
    }

    if (dto.includeVisualizations) {
      report.visualizations = await this.generateVisualizationData(report);
    }

    return report;
  }

  // ========== HELPER METHODS ==========

  private groupCitationsByYear(citations: any[]) {
    const grouped = {};
    citations.forEach((c) => {
      const year = c.citationDate
        ? new Date(c.citationDate).getFullYear()
        : 'Unknown';
      grouped[year] = (grouped[year] || 0) + 1;
    });
    return grouped;
  }

  private groupCitationsBySource(citations: any[]) {
    const grouped = {};
    citations.forEach((c) => {
      const source = c.source || 'Unknown';
      grouped[source] = (grouped[source] || 0) + 1;
    });
    return grouped;
  }

  private groupCitationsByType(citations: any[]) {
    const grouped = {};
    citations.forEach((c) => {
      const type = c.citationType || 'Unknown';
      grouped[type] = (grouped[type] || 0) + 1;
    });
    return grouped;
  }

  private calculateAverageCitationsPerYear(
    citations: any[],
    publicationDate: Date | null,
  ) {
    if (!publicationDate || citations.length === 0) return 0;

    const yearsSincePublication =
      new Date().getFullYear() - new Date(publicationDate).getFullYear();
    return yearsSincePublication > 0
      ? (citations.length / yearsSincePublication).toFixed(2)
      : citations.length;
  }

  private calculateCitationTrend(citations: any[]) {
    const byYear = this.groupCitationsByYear(citations);
    const years = Object.keys(byYear).sort();

    if (years.length < 2) return 'insufficient_data';

    const recent = byYear[years[years.length - 1]] || 0;
    const previous = byYear[years[years.length - 2]] || 0;

    if (recent > previous) return 'increasing';
    if (recent < previous) return 'decreasing';
    return 'stable';
  }

  private calculateH5Index(citations: any[]) {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    const recentCitations = citations.filter(
      (c) => c.citationDate && new Date(c.citationDate) >= fiveYearsAgo,
    );

    return recentCitations.length;
  }

  private findPeakCitationYear(citations: any[]) {
    const byYear = this.groupCitationsByYear(citations);
    let maxYear = null;
    let maxCount = 0;

    Object.entries(byYear).forEach(([year, count]) => {
      const countValue = typeof count === 'number' ? count : 0;
      if (countValue > maxCount) {
        maxCount = countValue;
        maxYear = year;
      }
    });

    return { year: maxYear, count: maxCount };
  }

  private calculateHIndex(publications: any[]) {
    const sortedCitations = publications
      .map((p) => p.citationCount || 0)
      .sort((a, b) => b - a);

    let hIndex = 0;
    for (let i = 0; i < sortedCitations.length; i++) {
      if (sortedCitations[i] >= i + 1) {
        hIndex = i + 1;
      } else {
        break;
      }
    }

    return hIndex;
  }

  private calculateI10Index(publications: any[]) {
    return publications.filter((p) => p.citationCount >= 10).length;
  }

  private calculateGIndex(publications: any[]) {
    const sortedCitations = publications
      .map((p) => p.citationCount || 0)
      .sort((a, b) => b - a);

    let gIndex = 0;
    let cumulativeSum = 0;

    for (let i = 0; i < sortedCitations.length; i++) {
      cumulativeSum += sortedCitations[i];
      if (cumulativeSum >= (i + 1) * (i + 1)) {
        gIndex = i + 1;
      } else {
        break;
      }
    }

    return gIndex;
  }

  private groupPublicationsByYear(publications: any[]) {
    const grouped = {};
    publications.forEach((p) => {
      const year = p.publicationDate
        ? new Date(p.publicationDate).getFullYear()
        : 'Unknown';
      grouped[year] = (grouped[year] || 0) + 1;
    });
    return grouped;
  }

  private groupByContributionType(contributions: any[]) {
    const grouped = {};
    contributions.forEach((c) => {
      grouped[c.contributionType] = (grouped[c.contributionType] || 0) + 1;
    });
    return grouped;
  }

  private groupByContributionLevel(contributions: any[]) {
    const grouped = {};
    contributions.forEach((c) => {
      grouped[c.contributionLevel] = (grouped[c.contributionLevel] || 0) + 1;
    });
    return grouped;
  }

  private getStartDateFromPeriod(period: string): Date {
    const now = new Date();
    const match = period.match(/^(\d+)([ymd])$/);

    if (!match) return new Date(0); // All time

    const [, num, unit] = match;
    const value = parseInt(num);

    switch (unit) {
      case 'y':
        now.setFullYear(now.getFullYear() - value);
        break;
      case 'm':
        now.setMonth(now.getMonth() - value);
        break;
      case 'd':
        now.setDate(now.getDate() - value);
        break;
    }

    return now;
  }

  private buildCollaborationNetwork(
    collaborations: any[],
    maxDepth: number,
    minStrength: number,
  ) {
    const nodes = new Map();
    const edges = [];

    collaborations.forEach((collab) => {
      const collabId = collab.collaborator.id;
      const piId = collab.researchRequest.principalInvestigator?.id;

      if (!nodes.has(collabId)) {
        nodes.set(collabId, {
          id: collabId,
          name: collab.collaborator.name,
          type: 'collaborator',
        });
      }

      if (piId && !nodes.has(piId)) {
        nodes.set(piId, {
          id: piId,
          name: collab.researchRequest.principalInvestigator.name,
          type: 'principal_investigator',
        });
      }

      if (piId && collabId) {
        edges.push({
          from: piId,
          to: collabId,
          strength: 1,
          research: collab.researchRequest.title,
        });
      }
    });

    return {
      nodes: Array.from(nodes.values()),
      edges,
      totalNodes: nodes.size,
      totalEdges: edges.length,
    };
  }

  private calculateEconomicImpact(research: any) {
    const innovations = research.innovations || [];
    const outcomes = research.outcomes || [];

    let estimatedValue = 0;

    innovations.forEach((innovation) => {
      if (innovation.economicValue) {
        estimatedValue += innovation.economicValue;
      }
    });

    return {
      estimatedValue,
      innovationCount: innovations.length,
      outcomes: outcomes.filter((o) => o.outcomeType === 'COST_REDUCTION')
        .length,
      description: 'Economic value from innovations and cost reductions',
    };
  }

  private calculateSocialImpact(research: any) {
    const outcomes = research.outcomes || [];
    const publications = research.publications || [];

    const socialOutcomes = outcomes.filter((o) =>
      [
        'PUBLIC_AWARENESS',
        'ACCESS_IMPROVEMENT',
        'QUALITY_IMPROVEMENT',
      ].includes(o.outcomeType),
    );

    return {
      estimatedValue: socialOutcomes.length * 50000, // Arbitrary value
      outcomesCount: socialOutcomes.length,
      publicationReach: publications.reduce(
        (sum, p) => sum + (p.downloadCount || 0),
        0,
      ),
      description: 'Social impact through outcomes and publication reach',
    };
  }

  private calculateAcademicImpact(research: any) {
    const publications = research.publications || [];
    const totalCitations = publications.reduce(
      (sum, p) => sum + p.citationCount,
      0,
    );

    return {
      estimatedValue: totalCitations * 1000 + publications.length * 5000,
      publicationCount: publications.length,
      citationCount: totalCitations,
      description: 'Academic impact based on publications and citations',
    };
  }

  private async generateSingleResearchReport(
    researchRequestId: string,
    format: string,
  ) {
    const research = await this.prisma.researchRequest.findUnique({
      where: { id: researchRequestId },
      include: {
        publications: {
          include: { citations: true },
        },
        innovations: true,
        outcomes: true,
        impactMetrics: true,
        principalInvestigator: {
          select: { name: true, email: true },
        },
      },
    });

    if (!research) {
      throw new NotFoundException('Research request not found');
    }

    return {
      researchId: researchRequestId,
      title: research.title,
      principalInvestigator: research.principalInvestigator.name,
      status: research.status,
      publications: {
        count: research.publications.length,
        totalCitations: research.publications.reduce(
          (sum, p) => sum + p.citationCount,
          0,
        ),
        list: format === 'detailed' ? research.publications : undefined,
      },
      innovations: {
        count: research.innovations.length,
        list: format === 'detailed' ? research.innovations : undefined,
      },
      outcomes: {
        count: research.outcomes.length,
        list: format === 'detailed' ? research.outcomes : undefined,
      },
      impactMetrics: research.impactMetrics.length,
    };
  }

  private async generateOverallImpactReport(
    startDate?: string,
    endDate?: string,
    format: string = 'summary',
  ) {
    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);

    const [publications, innovations, outcomes, research] =
      await Promise.all([
        this.prisma.researchPublication.count({
          where: startDate || endDate ? { createdAt: dateFilter } : undefined,
        }),
        this.prisma.researchInnovation.count({
          where: startDate || endDate ? { createdAt: dateFilter } : undefined,
        }),
        this.prisma.researchOutcome.count({
          where: startDate || endDate ? { createdAt: dateFilter } : undefined,
        }),
        this.prisma.researchRequest.count({
          where: startDate || endDate ? { createdAt: dateFilter } : undefined,
        }),
      ]);

    return {
      period: { startDate, endDate },
      totalResearch: research,
      totalPublications: publications,
      totalInnovations: innovations,
      totalOutcomes: outcomes,
    };
  }

  private async generateVisualizationData(report: any) {
    return {
      publicationTrend: report.publications?.list
        ? this.groupPublicationsByYear(report.publications.list)
        : {},
      citationTrend: {},
      innovationTypes: {},
      outcomeTypes: {},
    };
  }

  private async invalidateImpactCache(researchRequestId: string) {
    const patterns = [
      `roi-analysis:${researchRequestId}`,
      `citation-analysis:*`,
      `researcher-leaderboard:*`,
      `collaboration-network:${researchRequestId}`,
    ];

    for (const pattern of patterns) {
      try {
        if (pattern.includes('*')) {
          // Redis SCAN for pattern matching
          await this.redisService.del(pattern);
        } else {
          await this.redisService.del(pattern);
        }
      } catch (error) {
        this.logger.warn(`Failed to invalidate cache: ${pattern}`, error);
      }
    }
  }
}
