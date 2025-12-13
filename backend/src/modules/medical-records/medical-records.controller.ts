import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { RecordType } from '@prisma/client';

@ApiTags('Medical Records')
@Controller('medical-records')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new medical record' })
  @ApiResponse({ status: 201, description: 'Medical record created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'medical_record')
  async createMedicalRecord(@Body() createRecordDto: {
    patientId: string;
    recordType: RecordType;
    chiefComplaint?: string;
    historyOfPresent?: string;
    pastMedical?: any;
    surgicalHistory?: any;
    familyHistory?: any;
    socialHistory?: any;
    reviewOfSystems?: any;
    physicalExam?: any;
    assessment?: string;
    plan?: string;
    notes?: string;
    isConfidential?: boolean;
  }) {
    return await this.medicalRecordsService.createMedicalRecord({
      ...createRecordDto,
      providerId: 'current-user-id', // This should come from authenticated user
    });
  }

  @Get()
  @ApiOperation({ summary: 'Search medical records with filters' })
  @ApiResponse({ status: 200, description: 'Medical records retrieved successfully' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  @ApiQuery({ name: 'recordType', required: false, enum: RecordType })
  @ApiQuery({ name: 'isConfidential', required: false, type: Boolean })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchMedicalRecords(@Query() searchQuery: any) {
    const data: any = { ...searchQuery };
    if (searchQuery.dateFrom) {
      data.dateFrom = new Date(searchQuery.dateFrom);
    }
    if (searchQuery.dateTo) {
      data.dateTo = new Date(searchQuery.dateTo);
    }
    return await this.medicalRecordsService.searchMedicalRecords(data);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get medical record statistics' })
  @ApiResponse({ status: 200, description: 'Medical record statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'providerId', required: false })
  async getStatistics(
    @Query('centerId') centerId?: string,
    @Query('providerId') providerId?: string,
  ) {
    return await this.medicalRecordsService.getMedicalRecordStatistics(centerId, providerId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical records by patient ID' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Medical records retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'recordType', required: false, enum: RecordType })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByPatientId(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('recordType') recordType?: RecordType,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.medicalRecordsService.findByPatientId(
      patientId,
      recordType,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  @ApiResponse({ status: 200, description: 'Medical record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.medicalRecordsService.findById(id);
  }

  @Get('number/:recordNumber')
  @ApiOperation({ summary: 'Get medical record by record number' })
  @ApiParam({ name: 'recordNumber', description: 'Medical record number' })
  @ApiResponse({ status: 200, description: 'Medical record retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @RequirePermissions('MEDICAL_RECORDS_READ')
  async findByRecordNumber(@Param('recordNumber') recordNumber: string) {
    return await this.medicalRecordsService.findByRecordNumber(recordNumber);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update medical record' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  @ApiResponse({ status: 200, description: 'Medical record updated successfully' })
  @ApiResponse({ status: 404, description: 'Medical record not found' })
  @RequirePermissions('MEDICAL_RECORDS_UPDATE')
  @AuditLog('UPDATE', 'medical_record')
  async updateMedicalRecord(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecordDto: {
      chiefComplaint?: string;
      historyOfPresent?: string;
      pastMedical?: any;
      surgicalHistory?: any;
      familyHistory?: any;
      socialHistory?: any;
      reviewOfSystems?: any;
      physicalExam?: any;
      assessment?: string;
      plan?: string;
      notes?: string;
      isConfidential?: boolean;
    },
  ) {
    return await this.medicalRecordsService.updateMedicalRecord(
      id,
      updateRecordDto,
      'current-user-id' // This should come from authenticated user
    );
  }

  // Quick record templates

  @Post('templates/initial-visit')
  @ApiOperation({ summary: 'Create initial visit medical record template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'initial_visit_record')
  async createInitialVisitRecord(@Body() createRecordDto: {
    patientId: string;
    chiefComplaint: string;
    historyOfPresent: string;
    pastMedical?: any;
    surgicalHistory?: any;
    familyHistory?: any;
    socialHistory?: any;
    reviewOfSystems?: any;
    physicalExam?: any;
    assessment?: string;
    plan?: string;
    notes?: string;
  }) {
    return await this.medicalRecordsService.createMedicalRecord({
      ...createRecordDto,
      recordType: 'INITIAL',
      providerId: 'current-user-id',
    });
  }

  @Post('templates/progress-note')
  @ApiOperation({ summary: 'Create progress note medical record template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'progress_note')
  async createProgressNote(@Body() createRecordDto: {
    patientId: string;
    chiefComplaint?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
    isConfidential?: boolean;
  }) {
    return await this.medicalRecordsService.createMedicalRecord({
      ...createRecordDto,
      recordType: 'PROGRESS',
      providerId: 'current-user-id',
    });
  }

  @Post('templates/discharge-summary')
  @ApiOperation({ summary: 'Create discharge summary medical record template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'discharge_summary')
  async createDischargeSummary(@Body() createRecordDto: {
    patientId: string;
    assessment?: string;
    plan?: string;
    notes?: string;
    isConfidential?: boolean;
  }) {
    return await this.medicalRecordsService.createMedicalRecord({
      ...createRecordDto,
      recordType: 'DISCHARGE',
      providerId: 'current-user-id',
    });
  }

  @Post('templates/consultation')
  @ApiOperation({ summary: 'Create consultation medical record template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'consultation_record')
  async createConsultationRecord(@Body() createRecordDto: {
    patientId: string;
    chiefComplaint?: string;
    historyOfPresent?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
    isConfidential?: boolean;
  }) {
    return await this.medicalRecordsService.createMedicalRecord({
      ...createRecordDto,
      recordType: 'CONSULTATION',
      providerId: 'current-user-id',
    });
  }

  @Post('templates/emergency')
  @ApiOperation({ summary: 'Create emergency medical record template' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'emergency_record')
  async createEmergencyRecord(@Body() createRecordDto: {
    patientId: string;
    chiefComplaint: string;
    historyOfPresent?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
    isConfidential?: boolean;
  }) {
    return await this.medicalRecordsService.createMedicalRecord({
      ...createRecordDto,
      recordType: 'EMERGENCY',
      providerId: 'current-user-id',
    });
  }
}