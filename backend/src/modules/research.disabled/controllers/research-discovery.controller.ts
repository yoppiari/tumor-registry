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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AdvancedSearchService } from '../services/advanced-search.service';
import { CollaborationService } from '../services/collaboration.service';
import { ResearchPlanningService } from '../services/research-planning.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { EnhancedPermissionsGuard } from '@/auth/guards/enhanced-permissions.guard';
import { EnhancedThrottlerGuard } from '@/auth/guards/enhanced-throttler.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '../../../common/decorators/audit-log.decorator';
import {
  AdvancedSearchDto,
  SavedSearchDto,
  UpdateSavedSearchDto,
} from '../dto/advanced-search.dto';
import {
  CreateResearcherProfileDto,
  UpdateResearcherProfileDto,
  CreateResearchProjectDto,
  UpdateResearchProjectDto,
  AddProjectMemberDto,
  UpdateProjectMemberDto,
  CreateAnnotationDto,
  UpdateAnnotationDto,
  FindExpertsDto,
} from '../dto/collaboration.dto';
import {
  CheckDataAvailabilityDto,
  CalculateSampleSizeDto,
  AssessFeasibilityDto,
  CreateSimilarStudyDto,
  SearchSimilarStudiesDto,
} from '../dto/research-planning.dto';

@ApiTags('Research Discovery & Collaboration')
@Controller('research/discovery')
@UseGuards(JwtAuthGuard, EnhancedPermissionsGuard, EnhancedThrottlerGuard)
@ApiBearerAuth()
export class ResearchDiscoveryController {
  constructor(
    private readonly advancedSearchService: AdvancedSearchService,
    private readonly collaborationService: CollaborationService,
    private readonly researchPlanningService: ResearchPlanningService
  ) {}

  // Story 3.3: Advanced Data Search

  @Post('search/advanced')
  @ApiOperation({ summary: 'Perform advanced multi-criteria search with Boolean logic' })
  @ApiResponse({ status: 200, description: 'Search results with facets and relevance scores' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.OK)
  async advancedSearch(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true })) searchDto: AdvancedSearchDto
  ) {
    return await this.advancedSearchService.advancedSearch(searchDto, req.user.userId);
  }

  @Post('search/save')
  @ApiOperation({ summary: 'Save a search with optional alerts' })
  @ApiResponse({ status: 201, description: 'Search saved successfully' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('SAVE', 'search')
  async saveSearch(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true })) saveSearchDto: SavedSearchDto
  ) {
    return await this.advancedSearchService.saveSearch(req.user.userId, saveSearchDto);
  }

  @Get('search/saved')
  @ApiOperation({ summary: 'Get all saved searches for current user' })
  @ApiResponse({ status: 200, description: 'Saved searches retrieved' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'includePublic', required: false, type: Boolean })
  async getSavedSearches(
    @Request() req,
    @Query('includePublic') includePublic?: boolean
  ) {
    return await this.advancedSearchService.getSavedSearches(
      req.user.userId,
      includePublic !== false
    );
  }

  @Get('search/saved/:id')
  @ApiOperation({ summary: 'Get a saved search by ID' })
  @ApiResponse({ status: 200, description: 'Saved search retrieved' })
  @ApiParam({ name: 'id', description: 'Saved search ID' })
  @RequirePermissions('RESEARCH_READ')
  async getSavedSearch(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.advancedSearchService.getSavedSearchById(id, req.user.userId);
  }

  @Put('search/saved/:id')
  @ApiOperation({ summary: 'Update a saved search' })
  @ApiResponse({ status: 200, description: 'Saved search updated' })
  @ApiParam({ name: 'id', description: 'Saved search ID' })
  @RequirePermissions('RESEARCH_READ')
  @AuditLog('UPDATE', 'saved_search')
  async updateSavedSearch(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateSavedSearchDto
  ) {
    return await this.advancedSearchService.updateSavedSearch(id, req.user.userId, updateDto);
  }

  @Delete('search/saved/:id')
  @ApiOperation({ summary: 'Delete a saved search' })
  @ApiResponse({ status: 200, description: 'Saved search deleted' })
  @ApiParam({ name: 'id', description: 'Saved search ID' })
  @RequirePermissions('RESEARCH_READ')
  @AuditLog('DELETE', 'saved_search')
  async deleteSavedSearch(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.advancedSearchService.deleteSavedSearch(id, req.user.userId);
  }

  @Post('search/saved/:id/execute')
  @ApiOperation({ summary: 'Execute a saved search' })
  @ApiResponse({ status: 200, description: 'Search executed successfully' })
  @ApiParam({ name: 'id', description: 'Saved search ID' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.OK)
  async executeSavedSearch(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.advancedSearchService.executeSavedSearch(id, req.user.userId);
  }

  @Get('search/suggestions')
  @ApiOperation({ summary: 'Get search suggestions for autocomplete' })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'query', required: true })
  @ApiQuery({ name: 'field', required: true })
  async getSearchSuggestions(
    @Query('query') query: string,
    @Query('field') field: string
  ) {
    return await this.advancedSearchService.getSearchSuggestions(query, field as any);
  }

  // Story 3.4: Research Collaboration Tools

  @Post('profiles')
  @ApiOperation({ summary: 'Create researcher profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'researcher_profile')
  async createResearcherProfile(
    @Body(new ValidationPipe({ whitelist: true })) createDto: CreateResearcherProfileDto
  ) {
    return await this.collaborationService.createResearcherProfile(createDto);
  }

  @Get('profiles/:userId')
  @ApiOperation({ summary: 'Get researcher profile by user ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @RequirePermissions('RESEARCH_READ')
  async getResearcherProfile(
    @Param('userId') userId: string
  ) {
    return await this.collaborationService.getResearcherProfile(userId);
  }

  @Put('profiles/:userId')
  @ApiOperation({ summary: 'Update researcher profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @RequirePermissions('RESEARCH_READ')
  @AuditLog('UPDATE', 'researcher_profile')
  async updateResearcherProfile(
    @Param('userId') userId: string,
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateResearcherProfileDto
  ) {
    return await this.collaborationService.updateResearcherProfile(userId, updateDto);
  }

  @Get('profiles')
  @ApiOperation({ summary: 'Search researcher profiles' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'keywords', required: false, type: [String] })
  @ApiQuery({ name: 'institution', required: false })
  @ApiQuery({ name: 'expertise', required: false, type: [String] })
  @ApiQuery({ name: 'isAvailableForCollab', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchProfiles(
    @Query('keywords') keywords?: string[],
    @Query('institution') institution?: string,
    @Query('expertise') expertise?: string[],
    @Query('isAvailableForCollab') isAvailableForCollab?: boolean,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return await this.collaborationService.searchResearcherProfiles({
      keywords: Array.isArray(keywords) ? keywords : keywords ? [keywords] : undefined,
      institution,
      expertise: Array.isArray(expertise) ? expertise : expertise ? [expertise] : undefined,
      isAvailableForCollab,
      page,
      limit,
    });
  }

  @Post('experts/find')
  @ApiOperation({ summary: 'Find expert matches based on research area' })
  @ApiResponse({ status: 200, description: 'Expert matches found' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.OK)
  async findExperts(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true })) findExpertsDto: FindExpertsDto
  ) {
    return await this.collaborationService.findExperts(req.user.userId, findExpertsDto);
  }

  @Post('projects')
  @ApiOperation({ summary: 'Create research project workspace' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'research_project')
  async createProject(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true })) createDto: CreateResearchProjectDto
  ) {
    return await this.collaborationService.createResearchProject(req.user.userId, createDto);
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Get research project details' })
  @ApiResponse({ status: 200, description: 'Project retrieved' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @RequirePermissions('RESEARCH_READ')
  async getProject(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.collaborationService.getResearchProject(id);
  }

  @Put('projects/:id')
  @ApiOperation({ summary: 'Update research project' })
  @ApiResponse({ status: 200, description: 'Project updated' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('UPDATE', 'research_project')
  async updateProject(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateResearchProjectDto
  ) {
    return await this.collaborationService.updateResearchProject(id, req.user.userId, updateDto);
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get user projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUserProjects(
    @Request() req,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return await this.collaborationService.getUserProjects(req.user.userId, {
      status,
      page,
      limit,
    });
  }

  @Post('projects/:projectId/members')
  @ApiOperation({ summary: 'Add team member to project' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('ADD', 'project_member')
  async addProjectMember(
    @Request() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body(new ValidationPipe({ whitelist: true })) addMemberDto: AddProjectMemberDto
  ) {
    return await this.collaborationService.addProjectMember(
      projectId,
      req.user.userId,
      addMemberDto
    );
  }

  @Put('projects/:projectId/members/:memberId')
  @ApiOperation({ summary: 'Update project member' })
  @ApiResponse({ status: 200, description: 'Member updated' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('UPDATE', 'project_member')
  async updateProjectMember(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateProjectMemberDto
  ) {
    return await this.collaborationService.updateProjectMember(projectId, memberId, updateDto);
  }

  @Delete('projects/:projectId/members/:memberId')
  @ApiOperation({ summary: 'Remove project member' })
  @ApiResponse({ status: 200, description: 'Member removed' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('REMOVE', 'project_member')
  async removeProjectMember(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string
  ) {
    return await this.collaborationService.removeProjectMember(projectId, memberId);
  }

  @Post('projects/:projectId/annotations')
  @ApiOperation({ summary: 'Create dataset annotation' })
  @ApiResponse({ status: 201, description: 'Annotation created' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'annotation')
  async createAnnotation(
    @Request() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body(new ValidationPipe({ whitelist: true })) createDto: CreateAnnotationDto
  ) {
    return await this.collaborationService.createAnnotation(projectId, req.user.userId, createDto);
  }

  @Get('projects/:projectId/annotations')
  @ApiOperation({ summary: 'Get project annotations' })
  @ApiResponse({ status: 200, description: 'Annotations retrieved' })
  @ApiParam({ name: 'projectId', description: 'Project ID' })
  @RequirePermissions('RESEARCH_READ')
  @ApiQuery({ name: 'datasetType', required: false })
  @ApiQuery({ name: 'datasetId', required: false })
  @ApiQuery({ name: 'annotationType', required: false })
  @ApiQuery({ name: 'isResolved', required: false, type: Boolean })
  async getAnnotations(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query('datasetType') datasetType?: string,
    @Query('datasetId') datasetId?: string,
    @Query('annotationType') annotationType?: string,
    @Query('isResolved') isResolved?: boolean
  ) {
    return await this.collaborationService.getAnnotations(projectId, {
      datasetType,
      datasetId,
      annotationType,
      isResolved,
    });
  }

  @Put('annotations/:id')
  @ApiOperation({ summary: 'Update annotation' })
  @ApiResponse({ status: 200, description: 'Annotation updated' })
  @ApiParam({ name: 'id', description: 'Annotation ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('UPDATE', 'annotation')
  async updateAnnotation(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true })) updateDto: UpdateAnnotationDto
  ) {
    return await this.collaborationService.updateAnnotation(id, req.user.userId, updateDto);
  }

  @Delete('annotations/:id')
  @ApiOperation({ summary: 'Delete annotation' })
  @ApiResponse({ status: 200, description: 'Annotation deleted' })
  @ApiParam({ name: 'id', description: 'Annotation ID' })
  @RequirePermissions('RESEARCH_UPDATE')
  @AuditLog('DELETE', 'annotation')
  async deleteAnnotation(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.collaborationService.deleteAnnotation(id, req.user.userId);
  }

  // Story 3.5: Research Planning Support

  @Post('planning/data-availability')
  @ApiOperation({ summary: 'Check data availability for research planning' })
  @ApiResponse({ status: 200, description: 'Data availability report generated' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.OK)
  async checkDataAvailability(
    @Body(new ValidationPipe({ whitelist: true })) checkDto: CheckDataAvailabilityDto
  ) {
    return await this.researchPlanningService.checkDataAvailability(checkDto);
  }

  @Post('planning/sample-size')
  @ApiOperation({ summary: 'Calculate required sample size with power analysis' })
  @ApiResponse({ status: 200, description: 'Sample size calculation completed' })
  @RequirePermissions('RESEARCH_READ')
  @HttpCode(HttpStatus.OK)
  async calculateSampleSize(
    @Body(new ValidationPipe({ whitelist: true })) calculateDto: CalculateSampleSizeDto
  ) {
    return await this.researchPlanningService.calculateSampleSize(calculateDto);
  }

  @Post('planning/feasibility')
  @ApiOperation({ summary: 'Assess research feasibility' })
  @ApiResponse({ status: 201, description: 'Feasibility assessment completed' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('ASSESS', 'feasibility')
  async assessFeasibility(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true })) assessDto: AssessFeasibilityDto
  ) {
    return await this.researchPlanningService.assessFeasibility(req.user.userId, assessDto);
  }

  @Post('planning/similar-studies')
  @ApiOperation({ summary: 'Add similar study to database' })
  @ApiResponse({ status: 201, description: 'Similar study added' })
  @RequirePermissions('RESEARCH_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'similar_study')
  async createSimilarStudy(
    @Request() req,
    @Body(new ValidationPipe({ whitelist: true })) createDto: CreateSimilarStudyDto
  ) {
    return await this.researchPlanningService.createSimilarStudy(req.user.userId, createDto);
  }

  @Get('planning/similar-studies')
  @ApiOperation({ summary: 'Search similar studies for methodology reference' })
  @ApiResponse({ status: 200, description: 'Similar studies retrieved' })
  @RequirePermissions('RESEARCH_READ')
  async searchSimilarStudies(
    @Query(new ValidationPipe({ transform: true, whitelist: true })) searchDto: SearchSimilarStudiesDto
  ) {
    return await this.researchPlanningService.searchSimilarStudies(searchDto);
  }
}
