import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { TreatmentsService } from './treatments.service';
import { CreateTreatmentPlanDto } from './dto/create-treatment-plan.dto';
import { UpdateTreatmentPlanDto } from './dto/update-treatment-plan.dto';
import { SearchTreatmentDto } from './dto/search-treatment.dto';
import { CreateTreatmentSessionDto } from './dto/create-treatment-session.dto';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { GenerateReportDto } from './dto/generate-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TreatmentPlan, TreatmentSession, MedicalRecord, QualityMetrics, TreatmentReport } from './interfaces/treatment.interface';

@ApiTags('treatments')
@Controller('treatments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  // Treatment Plan Endpoints
  @Post('plans')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Create new treatment plan' })
  @ApiResponse({ status: 201, description: 'Treatment plan created successfully', type: TreatmentPlan })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Patient already has an active treatment plan' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createTreatmentPlan(@Req() req: any, @Body() createTreatmentPlanDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    const userId = req.user.sub;
    return this.treatmentsService.createTreatmentPlan(createTreatmentPlanDto, userId);
  }

  @Get('plans')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  @ApiOperation({ summary: 'Search treatment plans with filters' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Patient ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Treatment plan status' })
  @ApiQuery({ name: 'modality', required: false, description: 'Treatment modality' })
  @ApiQuery({ name: 'intent', required: false, description: 'Treatment intent' })
  @ApiQuery({ name: 'primaryOncologist', required: false, description: 'Primary oncologist name' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Treatment plans retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllTreatmentPlans(
    @Query() searchDto: SearchTreatmentDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.treatmentsService.findAllTreatmentPlans({
      ...searchDto,
      page,
      limit,
      sortBy: sortBy as any,
      sortOrder: sortOrder || 'desc'
    });
  }

  @Get('plans/:id')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get treatment plan by ID' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan found', type: TreatmentPlan })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findTreatmentPlanById(@Param('id') id: string): Promise<TreatmentPlan> {
    return this.treatmentsService.findTreatmentPlanById(id);
  }

  @Patch('plans/:id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Update treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan updated successfully', type: TreatmentPlan })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateTreatmentPlan(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateTreatmentPlanDto: UpdateTreatmentPlanDto,
  ): Promise<TreatmentPlan> {
    const userId = req.user.sub;
    return this.treatmentsService.updateTreatmentPlan(id, updateTreatmentPlanDto, userId);
  }

  @Patch('plans/:id/activate')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Activate treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan activated successfully' })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  @ApiResponse({ status: 400, description: 'Cannot activate treatment plan' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async activateTreatmentPlan(@Req() req: any, @Param('id') id: string): Promise<TreatmentPlan> {
    const userId = req.user.sub;
    return this.treatmentsService.activateTreatmentPlan(id, userId);
  }

  @Patch('plans/:id/complete')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Complete treatment plan' })
  @ApiParam({ name: 'id', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment plan completed successfully' })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  @ApiResponse({ status: 400, description: 'Cannot complete treatment plan' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async completeTreatmentPlan(@Req() req: any, @Param('id') id: string): Promise<TreatmentPlan> {
    const userId = req.user.sub;
    return this.treatmentsService.completeTreatmentPlan(id, userId);
  }

  // Treatment Session Endpoints
  @Post('sessions')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Create new treatment session' })
  @ApiResponse({ status: 201, description: 'Treatment session created successfully', type: TreatmentSession })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createTreatmentSession(
    @Req() req: any,
    @Body() createTreatmentSessionDto: CreateTreatmentSessionDto
  ): Promise<TreatmentSession> {
    const userId = req.user.sub;
    return this.treatmentsService.createTreatmentSession(createTreatmentSessionDto, userId);
  }

  @Get('plans/:planId/sessions')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get treatment sessions for a plan' })
  @ApiParam({ name: 'planId', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Treatment sessions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findTreatmentSessionsByPlan(@Param('planId') planId: string): Promise<TreatmentSession[]> {
    return this.treatmentsService.findTreatmentSessionsByPlan(planId);
  }

  @Patch('sessions/:sessionId/complete')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Complete treatment session' })
  @ApiParam({ name: 'sessionId', description: 'Treatment session ID' })
  @ApiResponse({ status: 200, description: 'Treatment session completed successfully' })
  @ApiResponse({ status: 404, description: 'Treatment session not found' })
  @ApiResponse({ status: 400, description: 'Cannot complete treatment session' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async completeTreatmentSession(
    @Req() req: any,
    @Param('sessionId') sessionId: string,
    @Body() postAssessmentData: any
  ): Promise<TreatmentSession> {
    const userId = req.user.sub;
    return this.treatmentsService.completeTreatmentSession(sessionId, postAssessmentData, userId);
  }

  // Medical Records Endpoints
  @Post('medical-records')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Create new medical record' })
  @ApiResponse({ status: 201, description: 'Medical record created successfully', type: MedicalRecord })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createMedicalRecord(
    @Req() req: any,
    @Body() createMedicalRecordDto: CreateMedicalRecordDto
  ): Promise<MedicalRecord> {
    const userId = req.user.sub;
    return this.treatmentsService.createMedicalRecord(createMedicalRecordDto, userId);
  }

  @Get('patients/:patientId/medical-records')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get medical records for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return (default: 50)' })
  @ApiResponse({ status: 200, description: 'Medical records retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMedicalRecordsByPatient(
    @Param('patientId') patientId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number
  ): Promise<MedicalRecord[]> {
    return this.treatmentsService.findMedicalRecordsByPatient(patientId, limit);
  }

  // Quality Metrics Endpoints
  @Get('plans/:planId/quality-metrics')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Calculate quality metrics for treatment plan' })
  @ApiParam({ name: 'planId', description: 'Treatment plan ID' })
  @ApiResponse({ status: 200, description: 'Quality metrics calculated successfully', type: QualityMetrics })
  @ApiResponse({ status: 404, description: 'Treatment plan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async calculateQualityMetrics(@Param('planId') planId: string): Promise<QualityMetrics> {
    return this.treatmentsService.calculateQualityMetrics(planId);
  }

  // Reporting Endpoints
  @Post('reports')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Generate treatment report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully', type: TreatmentReport })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async generateTreatmentReport(
    @Req() req: any,
    @Body() generateReportDto: GenerateReportDto
  ): Promise<TreatmentReport> {
    const userId = req.user.sub;
    return this.treatmentsService.generateTreatmentReport(generateReportDto, userId);
  }

  // Advanced endpoints
  @Get('protocols')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get available treatment protocols' })
  @ApiQuery({ name: 'cancerType', required: false, description: 'Cancer type' })
  @ApiQuery({ name: 'stage', required: false, description: 'Cancer stage' })
  @ApiQuery({ name: 'lineOfTherapy', required: false, description: 'Line of therapy' })
  @ApiResponse({ status: 200, description: 'Treatment protocols retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTreatmentProtocols(
    @Query('cancerType') cancerType?: string,
    @Query('stage') stage?: string,
    @Query('lineOfTherapy') lineOfTherapy?: number
  ) {
    // Implementation would fetch from treatment protocol database
    return {
      protocols: [
        {
          id: 'protocol-1',
          name: 'AC-T for Breast Cancer',
          code: 'BR-AC-T-001',
          cancerType: 'Breast',
          stage: 'II',
          lineOfTherapy: 1,
          category: 'standard'
        }
      ],
      total: 1
    };
  }

  @Get('analytics/treatment-outcomes')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get treatment outcomes analytics' })
  @ApiQuery({ name: 'dateFrom', required: false, description: 'Start date for analysis' })
  @ApiQuery({ name: 'dateTo', required: false, description: 'End date for analysis' })
  @ApiQuery({ name: 'cancerType', required: false, description: 'Filter by cancer type' })
  @ApiQuery({ name: 'stage', required: false, description: 'Filter by cancer stage' })
  @ApiResponse({ status: 200, description: 'Treatment outcomes analytics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async getTreatmentOutcomesAnalytics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('cancerType') cancerType?: string,
    @Query('stage') stage?: string
  ) {
    // Implementation would provide comprehensive treatment outcomes analytics
    return {
      summary: {
        totalPatients: 1250,
        overallResponseRate: 68.5,
        medianProgressionFreeSurvival: 18.2,
        medianOverallSurvival: 42.8,
        oneYearSurvivalRate: 85.2,
        fiveYearSurvivalRate: 62.3
      },
      byCancerType: {
        'Breast': { patients: 450, responseRate: 75.2, medianOS: 58.5 },
        'Lung': { patients: 320, responseRate: 62.1, medianOS: 28.3 },
        'Colorectal': { patients: 280, responseRate: 68.9, medianOS: 45.7 },
        'Other': { patients: 200, responseRate: 65.3, medianOS: 38.2 }
      },
      byStage: {
        'I': { patients: 150, responseRate: 92.3, medianOS: 75.2 },
        'II': { patients: 380, responseRate: 85.1, medianOS: 65.8 },
        'III': { patients: 520, responseRate: 68.4, medianOS: 42.3 },
        'IV': { patients: 200, responseRate: 45.2, medianOS: 18.7 }
      },
      trends: [
        { month: '2024-01', patients: 85, avgResponseRate: 70.2 },
        { month: '2024-02', patients: 92, avgResponseRate: 68.9 },
        { month: '2024-03', patients: 88, avgResponseRate: 71.5 }
      ]
    };
  }

  @Get('analytics/toxicity-profiles')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get treatment toxicity profiles' })
  @ApiQuery({ name: 'treatmentType', required: false, description: 'Filter by treatment type' })
  @ApiQuery({ name: 'toxicityGrade', required: false, description: 'Filter by toxicity grade' })
  @ApiResponse({ status: 200, description: 'Toxicity profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async getToxicityProfiles(
    @Query('treatmentType') treatmentType?: string,
    @Query('toxicityGrade') toxicityGrade?: number
  ) {
    // Implementation would provide toxicity profile analytics
    return {
      summary: {
        totalPatients: 1250,
        patientsWithToxicity: 780,
        overallToxicityRate: 62.4,
        grade3PlusToxicityRate: 23.1
      },
      commonToxicities: [
        { type: 'Neutropenia', grade3Plus: 28.5, allGrades: 45.2 },
        { type: 'Anemia', grade3Plus: 15.3, allGrades: 32.1 },
        { type: 'Nausea/Vomiting', grade3Plus: 8.7, allGrades: 28.9 },
        { type: 'Fatigue', grade3Plus: 5.2, allGrades: 25.4 },
        { type: 'Mucositis', grade3Plus: 6.8, allGrades: 18.3 }
      ],
      byTreatmentType: {
        'chemotherapy': { toxicityRate: 68.2, grade3PlusRate: 28.5 },
        'radiotherapy': { toxicityRate: 45.7, grade3PlusRate: 12.3 },
        'targeted_therapy': { toxicityRate: 38.9, grade3PlusRate: 15.2 },
        'immunotherapy': { toxicityRate: 52.1, grade3PlusRate: 18.7 }
      }
    };
  }

  @Get('schedules/:date')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get treatment schedule for a specific date' })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter by department' })
  @ApiQuery({ name: 'modality', required: false, description: 'Filter by treatment modality' })
  @ApiResponse({ status: 200, description: 'Treatment schedule retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getTreatmentSchedule(
    @Param('date') date: string,
    @Query('department') department?: string,
    @Query('modality') modality?: string
  ) {
    // Implementation would fetch scheduled treatment sessions for the specified date
    return {
      date,
      totalSessions: 45,
      sessions: [
        {
          id: 'session-1',
          patientName: 'John Doe',
          treatmentType: 'Chemotherapy',
          time: '09:00',
          duration: 180,
          status: 'scheduled'
        }
      ]
    };
  }
}