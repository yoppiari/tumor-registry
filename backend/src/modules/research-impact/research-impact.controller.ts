import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { EnhancedThrottlerGuard } from '@/modules/auth/guards/enhanced-throttler.guard';
import { ResearchImpactService } from './research-impact.service';
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

@ApiTags('Research Impact')
@Controller('research-impact')
@UseGuards(JwtAuthGuard, EnhancedThrottlerGuard)
@ApiBearerAuth()
export class ResearchImpactController {
  constructor(private readonly impactService: ResearchImpactService) {}

  // ========== PUBLICATION ENDPOINTS ==========

  @Post('publications')
  @ApiOperation({ summary: 'Create a new publication record' })
  @ApiResponse({ status: 201, description: 'Publication created successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @HttpCode(HttpStatus.CREATED)
  async createPublication(
    @Body(ValidationPipe) dto: CreatePublicationDto,
    @Request() req,
  ) {
    return await this.impactService.createPublication(dto, req.user.userId);
  }

  @Get('publications/:id')
  @ApiOperation({ summary: 'Get publication details' })
  @ApiResponse({ status: 200, description: 'Publication details retrieved' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async getPublication(@Param('id') id: string) {
    return await this.impactService.getPublication(id);
  }

  @Put('publications/:id')
  @ApiOperation({ summary: 'Update publication details' })
  @ApiResponse({ status: 200, description: 'Publication updated successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async updatePublication(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdatePublicationDto,
    @Request() req,
  ) {
    return await this.impactService.updatePublication(id, dto, req.user.userId);
  }

  @Delete('publications/:id')
  @ApiOperation({ summary: 'Delete a publication' })
  @ApiResponse({ status: 200, description: 'Publication deleted successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async deletePublication(@Param('id') id: string) {
    return await this.impactService.deletePublication(id);
  }

  @Get('publications/research/:researchRequestId')
  @ApiOperation({ summary: 'Get all publications for a research request' })
  @ApiResponse({ status: 200, description: 'Publications retrieved successfully' })
  async getPublicationsByResearch(
    @Param('researchRequestId') researchRequestId: string,
  ) {
    return await this.impactService.getPublicationsByResearch(researchRequestId);
  }

  // ========== CITATION ENDPOINTS ==========

  @Post('citations')
  @ApiOperation({ summary: 'Add a citation to a publication' })
  @ApiResponse({ status: 201, description: 'Citation added successfully' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  @HttpCode(HttpStatus.CREATED)
  async createCitation(
    @Body(ValidationPipe) dto: CreateCitationDto,
    @Request() req,
  ) {
    return await this.impactService.createCitation(dto, req.user.userId);
  }

  @Get('citations/publication/:publicationId')
  @ApiOperation({ summary: 'Get all citations for a publication' })
  @ApiResponse({ status: 200, description: 'Citations retrieved successfully' })
  async getCitationsForPublication(
    @Param('publicationId') publicationId: string,
  ) {
    return await this.impactService.getCitationsForPublication(publicationId);
  }

  @Post('citations/analyze')
  @ApiOperation({ summary: 'Analyze citation patterns and trends' })
  @ApiResponse({ status: 200, description: 'Citation analysis completed' })
  @ApiResponse({ status: 404, description: 'Publication not found' })
  async analyzeCitations(@Body(ValidationPipe) dto: CitationAnalysisDto) {
    return await this.impactService.analyzeCitations(dto);
  }

  // ========== BIBLIOMETRIC INDICATORS ==========

  @Post('bibliometric-indicators')
  @ApiOperation({ summary: 'Calculate bibliometric indicators (h-index, i10-index, etc.)' })
  @ApiResponse({ status: 200, description: 'Bibliometric indicators calculated' })
  async calculateBibliometricIndicators(
    @Body(ValidationPipe) dto: BiblometricIndicatorsDto,
  ) {
    return await this.impactService.calculateBibliometricIndicators(dto);
  }

  // ========== RESEARCHER CONTRIBUTIONS ==========

  @Post('researcher-contributions')
  @ApiOperation({ summary: 'Get researcher contribution summary' })
  @ApiResponse({ status: 200, description: 'Contributions retrieved successfully' })
  async getResearcherContributions(
    @Body(ValidationPipe) dto: ResearcherContributionDto,
  ) {
    return await this.impactService.getResearcherContributions(dto);
  }

  @Get('researcher-leaderboard')
  @ApiOperation({ summary: 'Get researcher leaderboard with rankings' })
  @ApiResponse({ status: 200, description: 'Leaderboard retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of top researchers to retrieve (default: 20)' })
  async getResearcherLeaderboard(@Query('limit') limit?: number) {
    return await this.impactService.createResearcherLeaderboard(
      limit ? parseInt(limit as any) : 20,
    );
  }

  // ========== COLLABORATION NETWORK ==========

  @Post('collaboration-network')
  @ApiOperation({ summary: 'Get collaboration network visualization data' })
  @ApiResponse({ status: 200, description: 'Collaboration network retrieved' })
  async getCollaborationNetwork(
    @Body(ValidationPipe) dto: CollaborationNetworkDto,
  ) {
    return await this.impactService.getCollaborationNetwork(dto);
  }

  // ========== INNOVATION TRACKING ==========

  @Post('innovations')
  @ApiOperation({ summary: 'Track a research innovation (patent, tool, protocol, etc.)' })
  @ApiResponse({ status: 201, description: 'Innovation tracked successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @HttpCode(HttpStatus.CREATED)
  async trackInnovation(
    @Body(ValidationPipe) dto: InnovationTrackingDto,
    @Request() req,
  ) {
    return await this.impactService.trackInnovation(dto, req.user.userId);
  }

  @Get('innovations/research/:researchRequestId')
  @ApiOperation({ summary: 'Get all innovations for a research request' })
  @ApiResponse({ status: 200, description: 'Innovations retrieved successfully' })
  async getInnovationsByResearch(
    @Param('researchRequestId') researchRequestId: string,
  ) {
    return await this.impactService.getInnovationsByResearch(researchRequestId);
  }

  // ========== ROI ANALYSIS ==========

  @Post('roi-analysis')
  @ApiOperation({ summary: 'Analyze Return on Investment (ROI) for research funding' })
  @ApiResponse({ status: 200, description: 'ROI analysis completed' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  async analyzeROI(@Body(ValidationPipe) dto: ROIAnalysisDto) {
    return await this.impactService.analyzeROI(dto);
  }

  // ========== IMPACT REPORTING ==========

  @Post('impact-report')
  @ApiOperation({ summary: 'Generate comprehensive impact report for stakeholders' })
  @ApiResponse({ status: 200, description: 'Impact report generated successfully' })
  async generateImpactReport(@Body(ValidationPipe) dto: ImpactReportDto) {
    return await this.impactService.generateImpactReport(dto);
  }

  // ========== IMPACT METRICS ==========

  @Post('impact-metrics')
  @ApiOperation({ summary: 'Create a new impact metric entry' })
  @ApiResponse({ status: 201, description: 'Impact metric created successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @HttpCode(HttpStatus.CREATED)
  async createImpactMetric(
    @Body(ValidationPipe) dto: CreateImpactMetricDto,
    @Request() req,
  ) {
    // This would delegate to the existing ResearchImpactMetric functionality
    // For now, we can add a simple passthrough
    const metric = await this.impactService['prisma'].researchImpactMetric.create({
      data: {
        researchRequestId: dto.researchRequestId,
        metricType: dto.metricType,
        value: dto.value,
        unit: dto.unit,
        description: dto.description,
        date: dto.date ? new Date(dto.date) : new Date(),
        source: dto.source,
        methodology: dto.methodology,
        baseline: dto.baseline,
        target: dto.target,
        category: dto.category,
        tags: dto.tags,
        notes: dto.notes,
        createdBy: req.user.userId,
      },
    });
    return metric;
  }
}
