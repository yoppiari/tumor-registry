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
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { EnhancedPermissionsGuard } from '@/modules/auth/guards/enhanced-permissions.guard';
import { EnhancedThrottlerGuard } from '@/modules/auth/guards/enhanced-throttler.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '../../common/decorators/audit-log.decorator';
import { EnhancedCreateResearchRequestDto, EnhancedUpdateResearchRequestDto, EnhancedSearchResearchDto, EnhancedApprovalDto } from './dto/enhanced-research-request.dto';
import { ResearchRequestStatus, StudyType, EthicsStatus } from '@prisma/client';

@ApiTags('Research Management')
@Controller('research')
@UseGuards(JwtAuthGuard, EnhancedPermissionsGuard, EnhancedThrottlerGuard)
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Post('requests')
  @ApiOperation({ summary: 'Create new research request' })
  @ApiResponse({ status: 201, description: 'Research request created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'research_request')
  async createResearchRequest(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createResearchRequestDto: EnhancedCreateResearchRequestDto
  ) {
    return await this.researchService.createResearchRequest(createResearchRequestDto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Search research requests' })
  @ApiResponse({ status: 200, description: 'Research requests retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'status', required: false, enum: ResearchRequestStatus })
  @ApiQuery({ name: 'studyType', required: false, enum: StudyType })
  @ApiQuery({ name: 'principalInvestigatorId', required: false })
  @ApiQuery({ name: 'ethicsStatus', required: false, enum: EthicsStatus })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchResearchRequests(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    searchQuery: EnhancedSearchResearchDto
  ) {
    return await this.researchService.getResearchRequests(searchQuery);
  }

  @Get('requests/:requestId')
  @ApiOperation({ summary: 'Get research request by ID' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Research request retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @RequirePermissions('RESEARCH_READ')
  async getResearchRequestById(@Param('requestId', ParseUUIDPipe) requestId: string) {
    return await this.researchService.getResearchRequestById(requestId);
  }

  @Put('requests/:requestId')
  @ApiOperation({ summary: 'Update research request' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Research request updated successfully' })
  @ApiResponse({ status: 404, description: 'Research request not found' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('UPDATE', 'research_request')
  async updateResearchRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() updateData: {
      title?: string;
      description?: string;
      objectives?: string;
      methodology?: string;
      inclusionCriteria?: string;
      exclusionCriteria?: string;
      sampleSize?: number;
      duration?: number;
      dataRequested?: string;
      confidentialityRequirements?: string;
      fundingSource?: string;
      collaborators?: string;
    }
  ) {
    return await this.researchService.updateResearchRequest(requestId, updateData);
  }

  @Put('requests/:requestId/approve')
  @ApiOperation({ summary: 'Approve research request' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Research request approved successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  @AuditLog('APPROVE', 'research_request')
  async approveResearchRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() approvalData: {
      approvedBy: string;
      comments?: string;
    }
  ) {
    return await this.researchService.approveResearchRequest(
      requestId,
      approvalData.approvedBy,
      approvalData.comments
    );
  }

  @Put('requests/:requestId/reject')
  @ApiOperation({ summary: 'Reject research request' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Research request rejected successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  @AuditLog('REJECT', 'research_request')
  async rejectResearchRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() rejectionData: {
      rejectionReason: string;
      reviewedBy: string;
    }
  ) {
    return await this.researchService.rejectResearchRequest(
      requestId,
      rejectionData.rejectionReason,
      rejectionData.reviewedBy
    );
  }

  @Put('requests/:requestId/ethics/review')
  @ApiOperation({ summary: 'Request ethics review' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Ethics review requested successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  @AuditLog('REQUEST', 'ethics_review')
  async requestEthicsReview(@Param('requestId', ParseUUIDPipe) requestId: string) {
    return await this.researchService.requestEthicsReview(requestId);
  }

  @Put('requests/:requestId/ethics/approve')
  @ApiOperation({ summary: 'Approve ethics for research request' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 200, description: 'Ethics approved successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  @AuditLog('APPROVE', 'ethics')
  async approveEthics(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() ethicsData: {
      approvedBy: string;
      ethicsNumber?: string;
    }
  ) {
    return await this.researchService.approveEthics(
      requestId,
      ethicsData.approvedBy,
      ethicsData.ethicsNumber
    );
  }

  @Post('requests/:requestId/export')
  @ApiOperation({ summary: 'Export research data' })
  @ApiParam({ name: 'requestId', description: 'Research request ID' })
  @ApiResponse({ status: 201, description: 'Data export initiated successfully' })
  @RequirePermissions('RESEARCH_EXPORT')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('EXPORT', 'research_data')
  async exportResearchData(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() exportData: {
      format: 'json' | 'csv' | 'excel';
      requestedBy: string;
    }
  ) {
    return await this.researchService.exportResearchData(
      requestId,
      exportData.format,
      exportData.requestedBy
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get research statistics' })
  @ApiResponse({ status: 200, description: 'Research statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  async getResearchStatistics(@Query('centerId') centerId?: string) {
    return await this.researchService.getResearchStatistics(centerId);
  }

  @Get('requests/pending')
  @ApiOperation({ summary: 'Get pending research requests' })
  @ApiResponse({ status: 200, description: 'Pending requests retrieved successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  async getPendingRequests(@Query('centerId') centerId?: string) {
    return await this.researchService.getResearchRequests({
      status: 'PENDING_REVIEW',
      centerId: centerId ? { principalInvestigator: { centerId } } : undefined,
    });
  }

  @Get('requests/my-requests')
  @ApiOperation({ summary: 'Get my research requests' })
  @ApiResponse({ status: 200, description: 'My requests retrieved successfully' })
  @RequirePermissions('RESEARCH_READ')
  async getMyRequests(@Query('principalInvestigatorId') principalInvestigatorId: string) {
    return await this.researchService.getResearchRequests({
      principalInvestigatorId,
    });
  }

  @Get('ethics/pending')
  @ApiOperation({ summary: 'Get requests pending ethics review' })
  @ApiResponse({ status: 200, description: 'Ethics pending requests retrieved successfully' })
  @RequirePermissions('RESEARCH_APPROVE')
  async getEthicsPendingRequests(@Query('centerId') centerId?: string) {
    return await this.researchService.getResearchRequests({
      ethicsStatus: 'PENDING',
      centerId: centerId ? { principalInvestigator: { centerId } } : undefined,
    });
  }

  // Research request templates

  @Post('templates/observational-study')
  @ApiOperation({ summary: 'Create observational study request template' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'observational_study_request')
  async createObservationalStudyRequest(@Body() studyData: {
    title: string;
    principalInvestigatorId: string;
    description: string;
    objectives: string;
    cancerType: string;
    sampleSize: number;
    duration: number;
    fundingSource?: string;
  }) {
    return await this.researchService.createResearchRequest({
      title: `Observational Study: ${studyData.title}`,
      description: studyData.description,
      principalInvestigatorId: studyData.principalInvestigatorId,
      studyType: 'OBSERVATIONAL',
      objectives: studyData.objectives,
      methodology: `Retrospective and prospective observational study of ${studyData.cancerType} patients`,
      inclusionCriteria: `Patients diagnosed with ${studyData.cancerType}`,
      exclusionCriteria: `Patients without confirmed ${studyData.cancerType} diagnosis`,
      sampleSize: studyData.sampleSize,
      duration: studyData.duration,
      requiresEthicsApproval: true,
      dataRequested: `Patient demographics, diagnosis, treatment, and outcomes data for ${studyData.cancerType}`,
      confidentialityRequirements: 'All patient data will be de-identified and stored securely',
      fundingSource: studyData.fundingSource,
    });
  }

  @Post('templates/clinical-outcome-study')
  @ApiOperation({ summary: 'Create clinical outcome study request template' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'outcome_study_request')
  async createClinicalOutcomeStudyRequest(@Body() outcomeData: {
    title: string;
    principalInvestigatorId: string;
    description: string;
    cancerType: string;
    treatmentType: string;
    objectives: string;
    sampleSize: number;
    duration: number;
    fundingSource?: string;
  }) {
    return await this.researchService.createResearchRequest({
      title: `Clinical Outcome Study: ${outcomeData.title}`,
      description: outcomeData.description,
      principalInvestigatorId: outcomeData.principalInvestigatorId,
      studyType: 'COHORT',
      objectives: outcomeData.objectives,
      methodology: `Prospective cohort study analyzing outcomes of ${outcomeData.treatmentType} in ${outcomeData.cancerType} patients`,
      inclusionCriteria: `Patients with ${outcomeData.cancerType} receiving ${outcomeData.treatmentType}`,
      exclusionCriteria: `Patients with incomplete treatment data or lost to follow-up`,
      sampleSize: outcomeData.sampleSize,
      duration: outcomeData.duration,
      requiresEthicsApproval: true,
      dataRequested: `Treatment details, response rates, survival outcomes, and adverse events data`,
      confidentialityRequirements: 'Strict confidentiality with limited access to treatment outcomes',
      fundingSource: outcomeData.fundingSource,
    });
  }

  @Post('templates/registry-based-study')
  @ApiOperation({ summary: 'Create registry-based study request template' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'registry_study_request')
  async createRegistryBasedStudyRequest(@Body() registryData: {
    title: string;
    principalInvestigatorId: string;
    description: string;
    objectives: string;
    dataElements: string[];
    sampleSize: number;
    duration: number;
    fundingSource?: string;
  }) {
    return await this.researchService.createResearchRequest({
      title: `Registry-Based Study: ${registryData.title}`,
      description: registryData.description,
      principalInvestigatorId: registryData.principalInvestigatorId,
      studyType: 'REGISTRY_BASED',
      objectives: registryData.objectives,
      methodology: 'Registry-based retrospective analysis using cancer registry data',
      inclusionCriteria: 'All patients in the cancer registry meeting study criteria',
      exclusionCriteria: 'Patients with incomplete or missing data elements',
      sampleSize: registryData.sampleSize,
      duration: registryData.duration,
      requiresEthicsApproval: true,
      dataRequested: `Registry data including: ${registryData.dataElements.join(', ')}`,
      confidentialityRequirements: 'Registry data with standard privacy protections',
      fundingSource: registryData.fundingSource,
    });
  }

  @Post('templates/quality-improvement-study')
  @ApiOperation({ summary: 'Create quality improvement study request template' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'quality_improvement_request')
  async createQualityImprovementStudyRequest(@Body() qualityData: {
    title: string;
    principalInvestigatorId: string;
    description: string;
    qualityMetrics: string[];
    baselineData: string;
    objectives: string;
    duration: number;
    fundingSource?: string;
  }) {
    return await this.researchService.createResearchRequest({
      title: `Quality Improvement Study: ${qualityData.title}`,
      description: qualityData.description,
      principalInvestigatorId: qualityData.principalInvestigatorId,
      studyType: 'OBSERVATIONAL',
      objectives: qualityData.objectives,
      methodology: `Quality improvement study focusing on ${qualityData.qualityMetrics.join(', ')}`,
      inclusionCriteria: 'Relevant patient cases for quality metrics analysis',
      exclusionCriteria: 'Cases not meeting inclusion criteria for quality assessment',
      sampleSize: 500, // Reasonable for QI studies
      duration: qualityData.duration,
      requiresEthicsApproval: false, // QI studies often exempt
      dataRequested: `Quality metrics data: ${qualityData.qualityMetrics.join(', ')}, ${qualityData.baselineData}`,
      confidentialityRequirements: 'Quality improvement data with limited identifiers',
      fundingSource: qualityData.fundingSource,
    });
  }
}