import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ResearchRequestsService } from './research-requests.service';
import {
  CreateResearchRequestDto,
  UpdateResearchRequestDto,
  ApproveResearchRequestDto,
  DataFiltersDto,
} from './dto/create-research-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { estimatePatientCount } from './helpers/patient-estimator';
import { PrismaService } from '../../database/prisma.service';

@Controller('research-requests')
@UseGuards(JwtAuthGuard)
export class ResearchRequestsController {
  constructor(
    private readonly researchRequestsService: ResearchRequestsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * POST /research-requests
   * Create new research request (draft)
   */
  @Post()
  create(@Request() req, @Body() dto: CreateResearchRequestDto) {
    return this.researchRequestsService.create(req.user.userId, dto);
  }

  /**
   * GET /research-requests
   * Get all research requests for current user
   */
  @Get()
  findAll(@Request() req, @Query() filters?: any) {
    return this.researchRequestsService.findAll(req.user.userId, filters);
  }

  /**
   * GET /research-requests/pending
   * Get pending requests for admin review
   */
  @Get('pending')
  @UseGuards(PermissionsGuard)
  @Permissions('RESEARCH_REQUESTS_REVIEW')
  findPending() {
    return this.researchRequestsService.findPending();
  }

  /**
   * POST /research-requests/estimate
   * Estimate patient count based on filters (for real-time estimation)
   */
  @Post('estimate')
  async estimatePatients(@Body() filters: DataFiltersDto) {
    const count = await estimatePatientCount(this.prisma, filters);
    return {
      estimatedCount: count,
      message: `Approximately ${count} patients match your criteria`,
    };
  }

  /**
   * GET /research-requests/:id
   * Get single research request details
   */
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.researchRequestsService.findOne(id, req.user.userId);
  }

  /**
   * PATCH /research-requests/:id
   * Update draft research request
   */
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateResearchRequestDto,
  ) {
    return this.researchRequestsService.update(id, req.user.userId, dto);
  }

  /**
   * POST /research-requests/:id/submit
   * Submit research request for approval
   */
  @Post(':id/submit')
  submit(@Request() req, @Param('id') id: string) {
    return this.researchRequestsService.submit(id, req.user.userId);
  }

  /**
   * POST /research-requests/:id/approve
   * Admin approve/reject research request
   */
  @Post(':id/approve')
  @UseGuards(PermissionsGuard)
  @Permissions('RESEARCH_REQUESTS_APPROVE')
  approveOrReject(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: ApproveResearchRequestDto,
  ) {
    return this.researchRequestsService.approveOrReject(id, req.user.userId, dto);
  }

  /**
   * POST /research-requests/:id/generate-export
   * Admin-only: Generate data export for approved request
   */
  @Post(':id/generate-export')
  @UseGuards(PermissionsGuard)
  @Permissions('RESEARCH_REQUESTS_APPROVE')
  generateExport(@Request() req, @Param('id') id: string) {
    return this.researchRequestsService.generateDataExport(id, req.user.userId);
  }

  /**
   * GET /research-requests/:id/download
   * Researcher: Get download URL for approved data
   */
  @Get(':id/download')
  getDownload(@Request() req, @Param('id') id: string) {
    return this.researchRequestsService.getDownloadUrl(id, req.user.userId);
  }

  /**
   * POST /research-requests/:id/request-extension
   * Researcher: Request access extension
   */
  @Post(':id/request-extension')
  requestExtension(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: { extensionMonths: number; justification: string },
  ) {
    return this.researchRequestsService.requestExtension(
      id,
      req.user.userId,
      dto.extensionMonths,
      dto.justification,
    );
  }

  /**
   * DELETE /research-requests/:id
   * Delete draft research request
   */
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.researchRequestsService.remove(id, req.user.userId);
  }
}
