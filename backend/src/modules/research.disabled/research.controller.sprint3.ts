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
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Request,
  Response,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ResearchSprint3Service } from './research.service.sprint3';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import {
  CreateResearchRequestDto,
  UpdateResearchRequestDto,
  CreateCollaborationDto,
} from './dto/create-research-request.dto';
import {
  CreateApprovalDto,
  UpdateApprovalDto,
} from './dto/create-approval.dto';
import {
  SearchResearchRequestDto,
  SearchCollaborationDto,
  SearchPublicationDto,
  SearchImpactMetricDto,
  SearchGeographicDataDto,
} from './dto/search-research.dto';
import {
  CreateDataAccessSessionDto,
  UpdateDataAccessSessionDto,
  SearchDataAccessSessionDto,
  AggregateDataQueryDto,
  GeographicVisualizationDto,
} from './dto/data-access.dto';
import {
  ResearchRequestStatus,
  ApprovalStatus,
  CollaborationStatus,
  ComplianceStatus,
  PublicationType,
  ImpactMetricType,
} from '@prisma/client';

@ApiTags('Research Discovery & Collaboration (Sprint 3)')
@ApiBearerAuth()
@Controller('research-sprint3')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ResearchSprint3Controller {
  constructor(private readonly researchService: ResearchSprint3Service) {}

  // ========== STORY 3.1: AGGREGATE DATA DISCOVERY ==========
  @Get('aggregate-statistics')
  @ApiOperation({ summary: 'Get aggregate cancer statistics with privacy controls' })
  @ApiResponse({ status: 200, description: 'Aggregate statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @RequirePermissions('DATA_ACCESS_AGGREGATE')
  @AuditLog('ACCESS', 'aggregate_statistics')
  async getAggregateStatistics(@Query() queryDto: AggregateDataQueryDto, @Request() req) {
    return await this.researchService.getAggregateStatistics(queryDto, req.user.userId);
  }

  @Get('cancer-trends')
  @ApiOperation({ summary: 'Get cancer trends over time' })
  @ApiQuery({ name: 'cancerType', required: false, description: 'Filter by cancer type' })
  @ApiQuery({ name: 'yearRange', required: false, description: 'Year range (e.g., 2018-2023)' })
  @ApiQuery({ name: 'location', required: false, description: 'Filter by location' })
  @ApiResponse({ status: 200, description: 'Trends data retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_AGGREGATE')
  @AuditLog('ACCESS', 'cancer_trends')
  async getCancerTrends(@Query() query: any, @Request() req) {
    const queryDto = {
      ...query,
      includeTrends: true,
      aggregateFunction: 'trend',
    };
    return await this.researchService.getAggregateStatistics(queryDto, req.user.userId);
  }

  @Get('demographic-analysis')
  @ApiOperation({ summary: 'Get demographic analysis of cancer data' })
  @ApiQuery({ name: 'ageGroups', required: false, description: 'Age groups to analyze' })
  @ApiQuery({ name: 'genders', required: false, description: 'Genders to include' })
  @ApiQuery({ name: 'cancerTypes', required: false, description: 'Cancer types to analyze' })
  @ApiResponse({ status: 200, description: 'Demographic analysis retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_AGGREGATE')
  @AuditLog('ACCESS', 'demographic_analysis')
  async getDemographicAnalysis(@Query() query: any, @Request() req) {
    const queryDto = {
      ...query,
      groupBy: 'demographics',
      aggregateFunction: 'demographic',
    };
    return await this.researchService.getAggregateStatistics(queryDto, req.user.userId);
  }

  // ========== STORY 3.2: GEOGRAPHIC CANCER VISUALIZATION ==========
  @Get('geographic-data')
  @ApiOperation({ summary: 'Get geographic cancer data for Indonesia map visualization' })
  @ApiResponse({ status: 200, description: 'Geographic data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @RequirePermissions('DATA_ACCESS_GEOGRAPHIC')
  @AuditLog('ACCESS', 'geographic_data')
  async getGeographicData(@Query() geoDto: GeographicVisualizationDto, @Request() req) {
    return await this.researchService.getGeographicData(geoDto, req.user.userId);
  }

  @Get('cancer-hotspots')
  @ApiOperation({ summary: 'Get cancer hotspots visualization data' })
  @ApiQuery({ name: 'cancerType', required: false, description: 'Filter by cancer type' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiQuery({ name: 'intensity', required: false, description: 'Hotspot intensity level' })
  @ApiResponse({ status: 200, description: 'Cancer hotspots data retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_GEOGRAPHIC')
  @AuditLog('ACCESS', 'cancer_hotspots')
  async getCancerHotspots(@Query() query: any, @Request() req) {
    const geoDto = {
      ...query,
      mapType: 'heatmap',
      metric: 'incidence_rate',
    };
    return await this.researchService.getGeographicData(geoDto, req.user.userId);
  }

  @Get('provincial-statistics')
  @ApiOperation({ summary: 'Get provincial cancer statistics' })
  @ApiQuery({ name: 'province', required: false, description: 'Specific province' })
  @ApiQuery({ name: 'year', required: false, description: 'Filter by year' })
  @ApiResponse({ status: 200, description: 'Provincial statistics retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_GEOGRAPHIC')
  @AuditLog('ACCESS', 'provincial_statistics')
  async getProvincialStatistics(@Query() query: any, @Request() req) {
    const geoDto = {
      ...query,
      groupBy: 'province',
    };
    return await this.researchService.getGeographicData(geoDto, req.user.userId);
  }

  // ========== STORY 4.1: RESEARCH DATA REQUESTS ==========
  @Post('research-requests')
  @ApiOperation({ summary: 'Create new research data request' })
  @ApiResponse({ status: 201, description: 'Research request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'research_request')
  async createResearchRequest(
    @Body() createResearchRequestDto: CreateResearchRequestDto,
    @Request() req
  ) {
    return await this.researchService.createResearchRequest(
      createResearchRequestDto,
      req.user.userId
    );
  }

  @Get('research-requests')
  @ApiOperation({ summary: 'Search and filter research requests' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by title or description' })
  @ApiQuery({ name: 'status', required: false, enum: ResearchRequestStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'studyType', required: false, description: 'Filter by study type' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Research requests retrieved successfully' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('SEARCH', 'research_requests')
  async getResearchRequests(@Query() searchDto: SearchResearchRequestDto, @Request() req) {
    return await this.researchService.getResearchRequests(searchDto, req.user.userId);
  }

  @Get('research-requests/:id')
  @ApiOperation({ summary: 'Get research request by ID' })
  @ApiParam({ name: 'id', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Research request retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('VIEW', 'research_request')
  async getResearchRequestById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req
  ) {
    return await this.researchService.getResearchRequestById(id, req.user.userId);
  }

  @Put('research-requests/:id')
  @ApiOperation({ summary: 'Update research request' })
  @ApiParam({ name: 'id', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Research request updated successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('UPDATE', 'research_request')
  async updateResearchRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateResearchRequestDto: UpdateResearchRequestDto,
    @Request() req
  ) {
    return await this.researchService.updateResearchRequest(
      id,
      updateResearchRequestDto,
      req.user.userId
    );
  }

  // ========== STORY 4.2: MULTI-LEVEL APPROVAL SYSTEM ==========
  @Post('approvals')
  @ApiOperation({ summary: 'Create or update research approval' })
  @ApiResponse({ status: 201, description: 'Approval created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid approval data' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient approval permissions' })
  @RequirePermissions('RESEARCH_APPROVE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'research_approval')
  async createApproval(@Body() createApprovalDto: CreateApprovalDto, @Request() req) {
    return await this.researchService.createApproval(createApprovalDto, req.user.userId);
  }

  @Get('research-requests/:id/approvals')
  @ApiOperation({ summary: 'Get all approvals for a research request' })
  @ApiParam({ name: 'id', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Approvals retrieved successfully' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('VIEW', 'research_approvals')
  async getApprovalsByResearchRequest(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req
  ) {
    return await this.researchService.getApprovalsByResearchRequest(id, req.user.userId);
  }

  @Put('approvals/:id')
  @ApiOperation({ summary: 'Update approval status' })
  @ApiParam({ name: 'id', description: 'Approval ID' })
  @ApiResponse({ status: 200, description: 'Approval updated successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  @AuditLog('UPDATE', 'research_approval')
  async updateApproval(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApprovalDto: UpdateApprovalDto,
    @Request() req
  ) {
    return await this.researchService.updateApproval(id, updateApprovalDto, req.user.userId);
  }

  @Get('my-approvals')
  @ApiOperation({ summary: 'Get pending approvals for current user' })
  @ApiQuery({ name: 'status', required: false, enum: ApprovalStatus, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Pending approvals retrieved successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  @AuditLog('VIEW', 'pending_approvals')
  async getMyApprovals(@Query() query: any, @Request() req) {
    return await this.researchService.getMyApprovals(query, req.user.userId);
  }

  // ========== STORY 4.3: RESEARCH COLLABORATION TOOLS ==========
  @Post('collaborations')
  @ApiOperation({ summary: 'Create research collaboration invitation' })
  @ApiResponse({ status: 201, description: 'Collaboration invitation sent successfully' })
  @RequirePermissions('RESEARCH_COLLABORATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'collaboration')
  async createCollaboration(@Body() createCollaborationDto: CreateCollaborationDto, @Request() req) {
    return await this.researchService.createCollaboration(createCollaborationDto, req.user.userId);
  }

  @Put('collaborations/:id/status')
  @ApiOperation({ summary: 'Update collaboration status (accept/decline)' })
  @ApiParam({ name: 'id', description: 'Collaboration ID' })
  @ApiQuery({ name: 'status', enum: CollaborationStatus, description: 'New collaboration status' })
  @ApiResponse({ status: 200, description: 'Collaboration status updated successfully' })
  @RequirePermissions('RESEARCH_COLLABORATE')
  @AuditLog('UPDATE', 'collaboration_status')
  async updateCollaborationStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: CollaborationStatus,
    @Request() req
  ) {
    return await this.researchService.updateCollaborationStatus(id, status, req.user.userId);
  }

  @Get('research-requests/:id/collaborations')
  @ApiOperation({ summary: 'Get collaborations for a research request' })
  @ApiParam({ name: 'id', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Collaborations retrieved successfully' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('VIEW', 'collaborations')
  async getCollaborations(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() searchDto: SearchCollaborationDto,
    @Request() req
  ) {
    return await this.researchService.getCollaborations(id, searchDto, req.user.userId);
  }

  @Get('my-collaborations')
  @ApiOperation({ summary: 'Get user collaboration invitations' })
  @ApiQuery({ name: 'status', required: false, enum: CollaborationStatus, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Collaborations retrieved successfully' })
  @RequirePermissions('RESEARCH_COLLABORATE')
  @AuditLog('VIEW', 'my_collaborations')
  async getMyCollaborations(@Query() query: any, @Request() req) {
    return await this.researchService.getMyCollaborations(query, req.user.userId);
  }

  // ========== STORY 4.4: DATA ACCESS CONTROLS ==========
  @Post('data-access-sessions')
  @ApiOperation({ summary: 'Start data access session' })
  @ApiResponse({ status: 201, description: 'Data access session created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient data access permissions' })
  @RequirePermissions('DATA_ACCESS_SESSION')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'data_access_session')
  async createDataAccessSession(
    @Body() createSessionDto: CreateDataAccessSessionDto,
    @Request() req
  ) {
    return await this.researchService.createDataAccessSession(createSessionDto, req.user.userId);
  }

  @Put('data-access-sessions/:id/end')
  @ApiOperation({ summary: 'End data access session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Data access session ended successfully' })
  @RequirePermissions('DATA_ACCESS_SESSION')
  @AuditLog('END', 'data_access_session')
  async endDataAccessSession(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: { dataAccessed: any; queriesExecuted: any },
    @Request() req
  ) {
    return await this.researchService.endDataAccessSession(
      id,
      new Date(),
      updateData.dataAccessed,
      updateData.queriesExecuted,
      req.user.userId
    );
  }

  @Get('data-access-sessions')
  @ApiOperation({ summary: 'Search data access sessions' })
  @ApiQuery({ name: 'researchRequestId', required: false, description: 'Filter by research request' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user' })
  @ApiQuery({ name: 'complianceStatus', required: false, enum: ComplianceStatus, description: 'Filter by compliance status' })
  @ApiResponse({ status: 200, description: 'Data access sessions retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_AUDIT')
  @AuditLog('VIEW', 'data_access_sessions')
  async getDataAccessSessions(@Query() searchDto: SearchDataAccessSessionDto, @Request() req) {
    return await this.researchService.getDataAccessSessions(searchDto, req.user.userId);
  }

  @Get('my-data-access-sessions')
  @ApiOperation({ summary: 'Get current user data access sessions' })
  @ApiResponse({ status: 200, description: 'Data access sessions retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_SESSION')
  @AuditLog('VIEW', 'my_data_access_sessions')
  async getMyDataAccessSessions(@Query() query: any, @Request() req) {
    return await this.researchService.getMyDataAccessSessions(query, req.user.userId);
  }

  // ========== STORY 4.5: RESEARCH IMPACT TRACKING ==========
  @Post('impact-metrics')
  @ApiOperation({ summary: 'Create research impact metric' })
  @ApiResponse({ status: 201, description: 'Impact metric created successfully' })
  @RequirePermissions('RESEARCH_IMPACT_TRACK')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'impact_metric')
  async createImpactMetric(@Body() metricData: any, @Request() req) {
    return await this.researchService.createImpactMetric(metricData, req.user.userId);
  }

  @Get('research-requests/:id/impact-metrics')
  @ApiOperation({ summary: 'Get impact metrics for research request' })
  @ApiParam({ name: 'id', description: 'Research request ID' })
  @ApiQuery({ name: 'metricType', required: false, enum: ImpactMetricType, description: 'Filter by metric type' })
  @ApiResponse({ status: 200, description: 'Impact metrics retrieved successfully' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('VIEW', 'impact_metrics')
  async getImpactMetrics(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() searchDto: SearchImpactMetricDto,
    @Request() req
  ) {
    return await this.researchService.getImpactMetricsByRequestId(id, searchDto, req.user.userId);
  }

  @Post('publications')
  @ApiOperation({ summary: 'Create research publication record' })
  @ApiResponse({ status: 201, description: 'Publication created successfully' })
  @RequirePermissions('RESEARCH_PUBLICATION')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'publication')
  async createPublication(@Body() publicationData: any, @Request() req) {
    return await this.researchService.createPublication(publicationData, req.user.userId);
  }

  @Get('research-requests/:id/publications')
  @ApiOperation({ summary: 'Get publications for research request' })
  @ApiParam({ name: 'id', description: 'Research request ID' })
  @ApiQuery({ name: 'publicationType', required: false, enum: PublicationType, description: 'Filter by publication type' })
  @ApiResponse({ status: 200, description: 'Publications retrieved successfully' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('VIEW', 'publications')
  async getPublications(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() searchDto: SearchPublicationDto,
    @Request() req
  ) {
    return await this.researchService.getPublications(id, searchDto, req.user.userId);
  }

  // ========== RESEARCH DASHBOARD AND ANALYTICS ==========
  @Get('dashboard/overview')
  @ApiOperation({ summary: 'Get research dashboard overview' })
  @ApiResponse({ status: 200, description: 'Dashboard overview retrieved successfully' })
  @RequirePermissions('RESEARCH_DASHBOARD')
  @AuditLog('VIEW', 'research_dashboard')
  async getDashboardOverview(@Request() req) {
    return await this.researchService.getDashboardOverview(req.user.userId);
  }

  @Get('analytics/workflow')
  @ApiOperation({ summary: 'Get research workflow analytics' })
  @ApiQuery({ name: 'dateRange', required: false, description: 'Date range for analytics' })
  @ApiResponse({ status: 200, description: 'Workflow analytics retrieved successfully' })
  @RequirePermissions('RESEARCH_ANALYTICS')
  @AuditLog('VIEW', 'workflow_analytics')
  async getWorkflowAnalytics(@Query() query: any, @Request() req) {
    return await this.researchService.getWorkflowAnalytics(query, req.user.userId);
  }

  @Get('analytics/compliance')
  @ApiOperation({ summary: 'Get compliance analytics' })
  @ApiQuery({ name: 'dateRange', required: false, description: 'Date range for analytics' })
  @ApiResponse({ status: 200, description: 'Compliance analytics retrieved successfully' })
  @RequirePermissions('DATA_ACCESS_AUDIT')
  @AuditLog('VIEW', 'compliance_analytics')
  async getComplianceAnalytics(@Query() query: any, @Request() req) {
    return await this.researchService.getComplianceAnalytics(query, req.user.userId);
  }

  // ========== UTILITIES AND HELPERS ==========
  @Get('stats/summary')
  @ApiOperation({ summary: 'Get research statistics summary' })
  @ApiResponse({ status: 200, description: 'Research statistics retrieved successfully' })
  @RequirePermissions('RESEARCH_VIEW')
  @AuditLog('VIEW', 'research_stats')
  async getResearchStats(@Request() req) {
    return await this.researchService.getResearchStats(req.user.userId);
  }

  @Get('export/clean-data')
  @ApiOperation({ summary: 'Export de-identified research data' })
  @ApiQuery({ name: 'researchRequestId', required: true, description: 'Research request ID' })
  @ApiQuery({ name: 'format', required: false, description: 'Export format (csv, json, xlsx)' })
  @ApiResponse({ status: 200, description: 'Data exported successfully' })
  @RequirePermissions('DATA_EXPORT')
  @AuditLog('EXPORT', 'research_data')
  async exportCleanData(@Query() query: any, @Request() req, @Response() res) {
    return await this.researchService.exportCleanData(query, res, req.user.userId);
  }

  @Post('validate-request')
  @ApiOperation({ summary: 'Validate research request before submission' })
  @ApiResponse({ status: 200, description: 'Request validation completed' })
  @RequirePermissions('RESEARCH_CREATE')
  @AuditLog('VALIDATE', 'research_request')
  async validateResearchRequest(@Body() requestData: any, @Request() req) {
    return await this.researchService.validateResearchRequestData(requestData, req.user.userId);
  }
}