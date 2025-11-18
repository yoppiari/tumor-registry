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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TreatmentsService } from './treatments.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { ProcedureStatus } from '@prisma/client';

@ApiTags('Treatments')
@Controller('treatments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient treatment' })
  @ApiResponse({ status: 201, description: 'Treatment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or date validation failed' })
  @RequirePermissions('TREATMENTS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_TREATMENT')
  async createTreatment(@Body() createTreatmentDto: {
    patientId: string;
    procedureName: string;
    procedureCode?: string;
    indication?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    status: ProcedureStatus;
    notes?: string;
  }) {
    return await this.treatmentsService.createTreatment({
      ...createTreatmentDto,
      startDate: new Date(createTreatmentDto.startDate),
      endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
      performedBy: 'current-user-id', // This should come from authenticated user
    });
  }

  @Get()
  @ApiOperation({ summary: 'Search treatments with filters' })
  @ApiResponse({ status: 200, description: 'Treatments retrieved successfully' })
  @RequirePermissions('TREATMENTS_READ')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ProcedureStatus })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchTreatments(@Query() searchQuery: any) {
    const data: any = { ...searchQuery };
    if (searchQuery.dateFrom) {
      data.dateFrom = new Date(searchQuery.dateFrom);
    }
    if (searchQuery.dateTo) {
      data.dateTo = new Date(searchQuery.dateTo);
    }
    return await this.treatmentsService.searchTreatments(data);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get treatment statistics' })
  @ApiResponse({ status: 200, description: 'Treatment statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  async getStatistics(
    @Query('centerId') centerId?: string,
    @Query('providerId') providerId?: string,
  ) {
    return await this.treatmentsService.getTreatmentStatistics(centerId, providerId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming scheduled treatments' })
  @ApiResponse({ status: 200, description: 'Upcoming treatments retrieved successfully' })
  @RequirePermissions('TREATMENTS_READ')
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Days ahead to look for treatments' })
  @ApiQuery({ name: 'centerId', required: false })
  async getUpcomingTreatments(
    @Query('days') days?: string,
    @Query('centerId') centerId?: string,
  ) {
    return await this.treatmentsService.getUpcomingTreatments(
      days ? parseInt(days) : 7,
      centerId
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get treatments by patient ID' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient treatments retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'status', required: false, enum: ProcedureStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('status') status?: ProcedureStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.treatmentsService.findByPatientId(
      patientId,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('patient/:patientId/active')
  @ApiOperation({ summary: 'Get active treatments for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Active treatments retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getActiveTreatmentsByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.treatmentsService.getActiveTreatmentsByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get treatment by ID' })
  @ApiParam({ name: 'id', description: 'Treatment ID' })
  @ApiResponse({ status: 200, description: 'Treatment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  @RequirePermissions('TREATMENTS_READ')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.treatmentsService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update treatment' })
  @ApiParam({ name: 'id', description: 'Treatment ID' })
  @ApiResponse({ status: 200, description: 'Treatment updated successfully' })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  @RequirePermissions('TREATMENTS_UPDATE')
  @AuditLog('UPDATE_TREATMENT')
  async updateTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTreatmentDto: {
      procedureName?: string;
      procedureCode?: string;
      indication?: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      status?: ProcedureStatus;
      outcome?: string;
      complications?: string;
      notes?: string;
    },
  ) {
    const data: any = { ...updateTreatmentDto };
    if (updateTreatmentDto.startDate) {
      data.startDate = new Date(updateTreatmentDto.startDate);
    }
    if (updateTreatmentDto.endDate) {
      data.endDate = new Date(updateTreatmentDto.endDate);
    }
    return await this.treatmentsService.updateTreatment(id, data);
  }

  @Put(':id/schedule')
  @ApiOperation({ summary: 'Schedule treatment' })
  @ApiParam({ name: 'id', description: 'Treatment ID' })
  @ApiResponse({ status: 200, description: 'Treatment scheduled successfully' })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  @RequirePermissions('TREATMENTS_UPDATE')
  @AuditLog('SCHEDULE_TREATMENT')
  async scheduleTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() scheduleDto: {
      startDate: string;
      endDate?: string;
    },
  ) {
    return await this.treatmentsService.scheduleTreatment(
      id,
      new Date(scheduleDto.startDate),
      scheduleDto.endDate ? new Date(scheduleDto.endDate) : undefined
    );
  }

  @Put(':id/start')
  @ApiOperation({ summary: 'Start treatment' })
  @ApiParam({ name: 'id', description: 'Treatment ID' })
  @ApiResponse({ status: 200, description: 'Treatment started successfully' })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  @RequirePermissions('TREATMENTS_UPDATE')
  @AuditLog('START_TREATMENT')
  async startTreatment(@Param('id', ParseUUIDPipe) id: string) {
    return await this.treatmentsService.startTreatment(id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Complete treatment' })
  @ApiParam({ name: 'id', description: 'Treatment ID' })
  @ApiResponse({ status: 200, description: 'Treatment completed successfully' })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  @RequirePermissions('TREATMENTS_UPDATE')
  @AuditLog('COMPLETE_TREATMENT')
  async completeTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completeDto: {
      outcome?: string;
      complications?: string;
    },
  ) {
    return await this.treatmentsService.completeTreatment(id, completeDto.outcome, completeDto.complications);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel treatment' })
  @ApiParam({ name: 'id', description: 'Treatment ID' })
  @ApiResponse({ status: 200, description: 'Treatment cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  @RequirePermissions('TREATMENTS_UPDATE')
  @AuditLog('CANCEL_TREATMENT')
  async cancelTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    return await this.treatmentsService.cancelTreatment(id, reason);
  }

  // Quick treatment templates

  @Post('templates/chemotherapy')
  @ApiOperation({ summary: 'Create chemotherapy treatment template' })
  @RequirePermissions('TREATMENTS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_CHEMOTHERAPY_TREATMENT')
  async createChemotherapyTreatment(@Body() createTreatmentDto: {
    patientId: string;
    protocol?: string;
    cycle?: string;
    indication?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    notes?: string;
  }) {
    return await this.treatmentsService.createTreatment({
      ...createTreatmentDto,
      procedureName: `Chemotherapy - ${createTreatmentDto.protocol || 'Standard Protocol'}`,
      procedureCode: this.generateChemoCode(createTreatmentDto.protocol),
      indication: createTreatmentDto.indication,
      description: createTreatmentDto.description,
      startDate: new Date(createTreatmentDto.startDate),
      endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
      status: 'SCHEDULED',
      performedBy: 'current-user-id',
      notes: createTreatmentDto.notes,
    });
  }

  @Post('templates/radiotherapy')
  @ApiOperation({ summary: 'Create radiotherapy treatment template' })
  @RequirePermissions('TREATMENTS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_RADIOTHERAPY_TREATMENT')
  async createRadiotherapyTreatment(@Body() createTreatmentDto: {
    patientId: string;
    technique?: string;
    dose?: string;
    fractions?: number;
    indication?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    notes?: string;
  }) {
    return await this.treatmentsService.createTreatment({
      ...createTreatmentDto,
      procedureName: `Radiotherapy - ${createTreatmentDto.technique || 'Standard Technique'}`,
      procedureCode: this.generateRadTherapyCode(createTreatmentDto.technique),
      indication: createTreatmentDto.indication,
      description: createTreatmentDto.description,
      startDate: new Date(createTreatmentDto.startDate),
      endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
      status: 'SCHEDULED',
      performedBy: 'current-user-id',
      notes: createTreatmentDto.notes,
    });
  }

  @Post('templates/surgery')
  @ApiOperation({ summary: 'Create surgery treatment template' })
  @RequirePermissions('TREATMENTS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_SURGERY_TREATMENT')
  async createSurgeryTreatment(@Body() createTreatmentDto: {
    patientId: string;
    procedure?: string;
    approach?: string;
    indication?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    notes?: string;
  }) {
    return await this.treatmentsService.createTreatment({
      ...createTreatmentDto,
      procedureName: `Surgery - ${createTreatmentDto.procedure || 'Standard Procedure'}`,
      procedureCode: this.generateSurgeryCode(createTreatmentDto.procedure),
      indication: createTreatmentDto.indication,
      description: createTreatmentDto.description,
      startDate: new Date(createTreatmentDto.startDate),
      endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
      status: 'SCHEDULED',
      performedBy: 'current-user-id',
      notes: createTreatmentDto.notes,
    });
  }

  @Post('templates/immunotherapy')
  @ApiOperation({ summary: 'Create immunotherapy treatment template' })
  @RequirePermissions('TREATMENTS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_IMMUNOTHERAPY_TREATMENT')
  async createImmunotherapyTreatment(@Body() createTreatmentDto: {
    patientId: string;
    agent?: string;
    regimen?: string;
    indication?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    notes?: string;
  }) {
    return await this.treatmentsService.createTreatment({
      ...createTreatmentDto,
      procedureName: `Immunotherapy - ${createTreatmentDto.agent || 'Standard Agent'}`,
      procedureCode: this.generateImmunoCode(createTreatmentDto.agent),
      indication: createTreatmentDto.indication,
      description: createTreatmentDto.description,
      startDate: new Date(createTreatmentDto.startDate),
      endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
      status: 'SCHEDULED',
      performedBy: 'current-user-id',
      notes: createTreatmentDto.notes,
    });
  }

  @Post('templates/targeted-therapy')
  @ApiOperation({ summary: 'Create targeted therapy treatment template' })
  @RequirePermissions('TREATMENTS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_TARGETED_THERAPY_TREATMENT')
  async createTargetedTherapyTreatment(@Body() createTreatmentDto: {
    patientId: string;
    drug?: string;
    target?: string;
    indication?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    notes?: string;
  }) {
    return await this.treatmentsService.createTreatment({
      ...createTreatmentDto,
      procedureName: `Targeted Therapy - ${createTreatmentDto.drug || 'Standard Drug'}`,
      procedureCode: this.generateTargetedCode(createTreatmentDto.drug),
      indication: createTreatmentDto.indication,
      description: createTreatmentDto.description,
      startDate: new Date(createTreatmentDto.startDate),
      endDate: createTreatmentDto.endDate ? new Date(createTreatmentDto.endDate) : undefined,
      status: 'SCHEDULED',
      performedBy: 'current-user-id',
      notes: createTreatmentDto.notes,
    });
  }

  // Helper methods for code generation (these would ideally connect to coding systems)
  private generateChemoCode(protocol?: string): string {
    return `CHEMO-${protocol?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
  }

  private generateRadTherapyCode(technique?: string): string {
    return `RAD-${technique?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
  }

  private generateSurgeryCode(procedure?: string): string {
    return `SURG-${procedure?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
  }

  private generateImmunoCode(agent?: string): string {
    return `IMMUNO-${agent?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
  }

  private generateTargetedCode(drug?: string): string {
    return `TARGET-${drug?.toUpperCase().replace(/\s+/g, '-') || 'STD'}`;
  }
}