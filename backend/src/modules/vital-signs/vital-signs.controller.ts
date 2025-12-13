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
import { VitalSignsService } from './vital-signs.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';

@ApiTags('Vital Signs')
@Controller('vital-signs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VitalSignsController {
  constructor(private readonly vitalSignsService: VitalSignsService) {}

  @Post()
  @ApiOperation({ summary: 'Record vital signs for patient' })
  @ApiResponse({ status: 201, description: 'Vital signs recorded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid vital signs data' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD', 'vital_signs')
  async recordVitalSigns(@Body() createVitalSignsDto: {
    patientId: string;
    temperature?: number;
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    height?: number;
    painScale?: number;
    bloodGlucose?: number;
    notes?: string;
    recordedBy: string;
  }) {
    return await this.vitalSignsService.recordVitalSign({
      patientId: createVitalSignsDto.patientId,
      temperature: createVitalSignsDto.temperature,
      bloodPressureSystolic: createVitalSignsDto.systolicBP,
      bloodPressureDiastolic: createVitalSignsDto.diastolicBP,
      heartRate: createVitalSignsDto.heartRate,
      respiratoryRate: createVitalSignsDto.respiratoryRate,
      oxygenSaturation: createVitalSignsDto.oxygenSaturation,
      weight: createVitalSignsDto.weight,
      height: createVitalSignsDto.height,
      painScale: createVitalSignsDto.painScale,
      bloodGlucose: createVitalSignsDto.bloodGlucose,
      notes: createVitalSignsDto.notes,
      recordedBy: createVitalSignsDto.recordedBy,
    });
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get vital signs history for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Vital signs retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getVitalSignsByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return await this.vitalSignsService.getVitalSignsByPatient(
      patientId,
      limit ? parseInt(limit) : 10,
      offset ? parseInt(offset) : 0,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    );
  }

  @Get('patient/:patientId/latest')
  @ApiOperation({ summary: 'Get latest vital signs for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Latest vital signs retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getLatestVitalSigns(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.vitalSignsService.getLatestVitalSign(patientId);
  }

  @Get('patient/:patientId/trends')
  @ApiOperation({ summary: 'Get vital signs trends for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Vital signs trends retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'parameter', required: true, description: 'Vital sign parameter to trend (e.g., temperature, heartRate)' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to analyze' })
  async getVitalSignsTrends(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('parameter') parameter: string,
    @Query('days') days?: string,
  ) {
    return await this.vitalSignsService.getVitalSignTrends(
      patientId,
      parameter,
      days ? parseInt(days) : 30
    );
  }

  @Get('patient/:patientId/abnormal')
  @ApiOperation({ summary: 'Get abnormal vital signs for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Abnormal vital signs retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'hours', required: false, type: Number, description: 'Number of hours to look back' })
  async getAbnormalVitalSigns(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('hours') hours?: string,
  ) {
    return await this.vitalSignsService.getVitalSignAlertsForPatient(
      patientId,
      hours ? parseInt(hours) : 24
    );
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get patients needing attention' })
  @ApiResponse({ status: 200, description: 'Patients needing attention retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getAlerts(
    @Query('centerId') centerId?: string,
  ) {
    return await this.vitalSignsService.getPatientsNeedingAttention(centerId);
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Get vital signs summary statistics' })
  @ApiResponse({ status: 200, description: 'Vital signs statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getVitalSignsStatistics(
    @Query('centerId') centerId?: string,
    @Query('days') days?: string,
  ) {
    return await this.vitalSignsService.getVitalSignStatistics(
      centerId,
      days ? parseInt(days) : 30
    );
  }

  @Get('monitoring/critical-patients')
  @ApiOperation({ summary: 'Get patients with critical vital signs' })
  @ApiResponse({ status: 200, description: 'Critical patients list retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getCriticalPatients(@Query('centerId') centerId?: string) {
    return await this.vitalSignsService.getPatientsNeedingAttention(centerId);
  }

  // Quick vital signs templates for common scenarios

  @Post('templates/initial-assessment')
  @ApiOperation({ summary: 'Record initial assessment vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD', 'vital_signs_initial_assessment')
  async recordInitialAssessment(@Body() assessmentDto: {
    patientId: string;
    temperature: number;
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    weight?: number;
    height?: number;
    painScale?: number;
    assessmentNotes?: string;
    recordedBy: string;
  }) {
    return await this.vitalSignsService.recordVitalSign({
      patientId: assessmentDto.patientId,
      temperature: assessmentDto.temperature,
      bloodPressureSystolic: assessmentDto.systolicBP,
      bloodPressureDiastolic: assessmentDto.diastolicBP,
      heartRate: assessmentDto.heartRate,
      respiratoryRate: assessmentDto.respiratoryRate,
      oxygenSaturation: assessmentDto.oxygenSaturation,
      weight: assessmentDto.weight,
      height: assessmentDto.height,
      painScale: assessmentDto.painScale,
      notes: `Initial Assessment: ${assessmentDto.assessmentNotes || 'Standard initial assessment'}`,
      recordedBy: assessmentDto.recordedBy,
    });
  }

  @Post('templates/chemotherapy-monitoring')
  @ApiOperation({ summary: 'Record chemotherapy monitoring vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD', 'vital_signs_chemotherapy')
  async recordChemotherapyMonitoring(@Body() chemoDto: {
    patientId: string;
    temperature: number;
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    toxicity?: string;
    cycleNumber?: string;
    notes?: string;
    recordedBy: string;
  }) {
    return await this.vitalSignsService.recordVitalSign({
      patientId: chemoDto.patientId,
      temperature: chemoDto.temperature,
      bloodPressureSystolic: chemoDto.systolicBP,
      bloodPressureDiastolic: chemoDto.diastolicBP,
      heartRate: chemoDto.heartRate,
      respiratoryRate: chemoDto.respiratoryRate,
      oxygenSaturation: chemoDto.oxygenSaturation,
      weight: chemoDto.weight,
      notes: `Chemotherapy Monitoring${chemoDto.cycleNumber ? ` - Cycle ${chemoDto.cycleNumber}` : ''}${chemoDto.toxicity ? ` | Toxicity: ${chemoDto.toxicity}` : ''}: ${chemoDto.notes || 'Routine chemo monitoring'}`,
      recordedBy: chemoDto.recordedBy,
    });
  }

  @Post('templates/pre-operative')
  @ApiOperation({ summary: 'Record pre-operative vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD', 'vital_signs_preoperative')
  async recordPreOperativeVitalSigns(@Body() preOpDto: {
    patientId: string;
    temperature: number;
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation?: number;
    procedureType?: string;
    asaClass?: string;
    fastingStatus?: string;
    notes?: string;
    recordedBy: string;
  }) {
    return await this.vitalSignsService.recordVitalSign({
      patientId: preOpDto.patientId,
      temperature: preOpDto.temperature,
      bloodPressureSystolic: preOpDto.systolicBP,
      bloodPressureDiastolic: preOpDto.diastolicBP,
      heartRate: preOpDto.heartRate,
      respiratoryRate: preOpDto.respiratoryRate,
      oxygenSaturation: preOpDto.oxygenSaturation,
      notes: `Pre-Op Assessment${preOpDto.procedureType ? ` | Procedure: ${preOpDto.procedureType}` : ''}${preOpDto.asaClass ? ` | ASA: ${preOpDto.asaClass}` : ''}${preOpDto.fastingStatus ? ` | Fasting: ${preOpDto.fastingStatus}` : ''}: ${preOpDto.notes || 'Routine pre-op assessment'}`,
      recordedBy: preOpDto.recordedBy,
    });
  }

  @Post('templates/post-operative')
  @ApiOperation({ summary: 'Record post-operative vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD', 'vital_signs_postoperative')
  async recordPostOperativeVitalSigns(@Body() postOpDto: {
    patientId: string;
    temperature: number;
    systolicBP: number;
    diastolicBP: number;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    painScale: number;
    consciousnessLevel?: string;
    bleeding?: string;
    procedureType?: string;
    postOpHour?: number;
    notes?: string;
    recordedBy: string;
  }) {
    return await this.vitalSignsService.recordVitalSign({
      patientId: postOpDto.patientId,
      temperature: postOpDto.temperature,
      bloodPressureSystolic: postOpDto.systolicBP,
      bloodPressureDiastolic: postOpDto.diastolicBP,
      heartRate: postOpDto.heartRate,
      respiratoryRate: postOpDto.respiratoryRate,
      oxygenSaturation: postOpDto.oxygenSaturation,
      painScale: postOpDto.painScale,
      notes: `Post-Op Assessment${postOpDto.procedureType ? ` | Procedure: ${postOpDto.procedureType}` : ''}${postOpDto.postOpHour ? ` | Hour ${postOpDto.postOpHour}` : ''}${postOpDto.consciousnessLevel ? ` | Consciousness: ${postOpDto.consciousnessLevel}` : ''}${postOpDto.bleeding ? ` | Bleeding: ${postOpDto.bleeding}` : ''}: ${postOpDto.notes || 'Routine post-op assessment'}`,
      recordedBy: postOpDto.recordedBy,
    });
  }
}