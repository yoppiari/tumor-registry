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
import { VitalSignType, AlertSeverity } from '@prisma/client';

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
  @AuditLog('RECORD_VITAL_SIGNS')
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
    notes?: string;
  }) {
    return await this.vitalSignsService.createVitalSigns({
      patientId: createVitalSignsDto.patientId,
      temperature: createVitalSignsDto.temperature,
      systolicBP: createVitalSignsDto.systolicBP,
      diastolicBP: createVitalSignsDto.diastolicBP,
      heartRate: createVitalSignsDto.heartRate,
      respiratoryRate: createVitalSignsDto.respiratoryRate,
      oxygenSaturation: createVitalSignsDto.oxygenSaturation,
      weight: createVitalSignsDto.weight,
      height: createVitalSignsDto.height,
      painScale: createVitalSignsDto.painScale,
      notes: createVitalSignsDto.notes,
    });
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get vital signs history for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Vital signs retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'type', required: false, enum: VitalSignType })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getVitalSignsByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('type') type?: VitalSignType,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.vitalSignsService.getVitalSignsByPatient(
      patientId,
      type,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    );
  }

  @Get('patient/:patientId/latest')
  @ApiOperation({ summary: 'Get latest vital signs for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Latest vital signs retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getLatestVitalSigns(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.vitalSignsService.getLatestVitalSigns(patientId);
  }

  @Get('patient/:patientId/trends')
  @ApiOperation({ summary: 'Get vital signs trends for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Vital signs trends retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to analyze' })
  async getVitalSignsTrends(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('days') days?: string,
  ) {
    return await this.vitalSignsService.getVitalSignsTrends(
      patientId,
      days ? parseInt(days) : 7
    );
  }

  @Get('patient/:patientId/abnormal')
  @ApiOperation({ summary: 'Get abnormal vital signs for patient' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Abnormal vital signs retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days to look back' })
  async getAbnormalVitalSigns(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('days') days?: string,
  ) {
    return await this.vitalSignsService.getAbnormalVitalSigns(
      patientId,
      days ? parseInt(days) : 30
    );
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get vital signs alerts' })
  @ApiResponse({ status: 200, description: 'Vital signs alerts retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'severity', required: false, enum: AlertSeverity })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAlerts(
    @Query('centerId') centerId?: string,
    @Query('severity') severity?: AlertSeverity,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.vitalSignsService.getAlerts(
      centerId,
      severity,
      unreadOnly === 'true',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20
    );
  }

  @Get('alerts/statistics')
  @ApiOperation({ summary: 'Get vital signs alert statistics' })
  @ApiResponse({ status: 200, description: 'Alert statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getAlertStatistics(
    @Query('centerId') centerId?: string,
    @Query('days') days?: string,
  ) {
    return await this.vitalSignsService.getAlertStatistics(
      centerId,
      days ? parseInt(days) : 7
    );
  }

  @Put('alerts/:alertId/acknowledge')
  @ApiOperation({ summary: 'Acknowledge vital signs alert' })
  @ApiParam({ name: 'alertId', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged successfully' })
  @RequirePermissions('MEDICAL_RECORDS_UPDATE')
  @AuditLog('ACKNOWLEDGE_VITAL_SIGNS_ALERT')
  async acknowledgeAlert(
    @Param('alertId', ParseUUIDPipe) alertId: string,
  ) {
    return await this.vitalSignsService.acknowledgeAlert(alertId);
  }

  @Get('statistics/summary')
  @ApiOperation({ summary: 'Get vital signs summary statistics' })
  @ApiResponse({ status: 200, description: 'Vital signs statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getVitalSignsStatistics(
    @Query('centerId') centerId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.vitalSignsService.getVitalSignsStatistics(
      centerId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    );
  }

  @Get('statistics/population-health')
  @ApiOperation({ summary: 'Get population health statistics' })
  @ApiResponse({ status: 200, description: 'Population health statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getPopulationHealthStatistics(
    @Query('centerId') centerId?: string,
    @Query('days') days?: string,
  ) {
    return await this.vitalSignsService.getPopulationHealthStatistics(
      centerId,
      days ? parseInt(days) : 30
    );
  }

  @Get('monitoring/ward/:wardId')
  @ApiOperation({ summary: 'Get ward monitoring overview' })
  @ApiParam({ name: 'wardId', description: 'Ward ID' })
  @ApiResponse({ status: 200, description: 'Ward monitoring data retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getWardMonitoring(@Param('wardId', ParseUUIDPipe) wardId: string) {
    return await this.vitalSignsService.getWardMonitoringOverview(wardId);
  }

  @Get('monitoring/critical-patients')
  @ApiOperation({ summary: 'Get patients with critical vital signs' })
  @ApiResponse({ status: 200, description: 'Critical patients list retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getCriticalPatients(@Query('centerId') centerId?: string) {
    return await this.vitalSignsService.getCriticalPatients(centerId);
  }

  // Quick vital signs templates for common scenarios

  @Post('templates/initial-assessment')
  @ApiOperation({ summary: 'Record initial assessment vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD_INITIAL_ASSESSMENT_VITAL_SIGNS')
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
  }) {
    return await this.vitalSignsService.createVitalSigns({
      patientId: assessmentDto.patientId,
      temperature: assessmentDto.temperature,
      systolicBP: assessmentDto.systolicBP,
      diastolicBP: assessmentDto.diastolicBP,
      heartRate: assessmentDto.heartRate,
      respiratoryRate: assessmentDto.respiratoryRate,
      oxygenSaturation: assessmentDto.oxygenSaturation,
      weight: assessmentDto.weight,
      height: assessmentDto.height,
      painScale: assessmentDto.painScale,
      notes: `Initial Assessment: ${assessmentDto.assessmentNotes || 'Standard initial assessment'}`,
    });
  }

  @Post('templates/chemotherapy-monitoring')
  @ApiOperation({ summary: 'Record chemotherapy monitoring vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD_CHEMOTHERAPY_VITAL_SIGNS')
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
  }) {
    return await this.vitalSignsService.createVitalSigns({
      patientId: chemoDto.patientId,
      temperature: chemoDto.temperature,
      systolicBP: chemoDto.systolicBP,
      diastolicBP: chemoDto.diastolicBP,
      heartRate: chemoDto.heartRate,
      respiratoryRate: chemoDto.respiratoryRate,
      oxygenSaturation: chemoDto.oxygenSaturation,
      weight: chemoDto.weight,
      notes: `Chemotherapy Monitoring${chemoDto.cycleNumber ? ` - Cycle ${chemoDto.cycleNumber}` : ''}${chemoDto.toxicity ? ` | Toxicity: ${chemoDto.toxicity}` : ''}: ${chemoDto.notes || 'Routine chemo monitoring'}`,
    });
  }

  @Post('templates/pre-operative')
  @ApiOperation({ summary: 'Record pre-operative vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD_PREOPERATIVE_VITAL_SIGNS')
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
  }) {
    return await this.vitalSignsService.createVitalSigns({
      patientId: preOpDto.patientId,
      temperature: preOpDto.temperature,
      systolicBP: preOpDto.systolicBP,
      diastolicBP: preOpDto.diastolicBP,
      heartRate: preOpDto.heartRate,
      respiratoryRate: preOpDto.respiratoryRate,
      oxygenSaturation: preOpDto.oxygenSaturation,
      notes: `Pre-Op Assessment${preOpDto.procedureType ? ` | Procedure: ${preOpDto.procedureType}` : ''}${preOpDto.asaClass ? ` | ASA: ${preOpDto.asaClass}` : ''}${preOpDto.fastingStatus ? ` | Fasting: ${preOpDto.fastingStatus}` : ''}: ${preOpDto.notes || 'Routine pre-op assessment'}`,
    });
  }

  @Post('templates/post-operative')
  @ApiOperation({ summary: 'Record post-operative vital signs' })
  @RequirePermissions('MEDICAL_RECORDS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('RECORD_POSTOPERATIVE_VITAL_SIGNS')
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
  }) {
    return await this.vitalSignsService.createVitalSigns({
      patientId: postOpDto.patientId,
      temperature: postOpDto.temperature,
      systolicBP: postOpDto.systolicBP,
      diastolicBP: postOpDto.diastolicBP,
      heartRate: postOpDto.heartRate,
      respiratoryRate: postOpDto.respiratoryRate,
      oxygenSaturation: postOpDto.oxygenSaturation,
      painScale: postOpDto.painScale,
      notes: `Post-Op Assessment${postOpDto.procedureType ? ` | Procedure: ${postOpDto.procedureType}` : ''}${postOpDto.postOpHour ? ` | Hour ${postOpDto.postOpHour}` : ''}${postOpDto.consciousnessLevel ? ` | Consciousness: ${postOpDto.consciousnessLevel}` : ''}${postOpDto.bleeding ? ` | Bleeding: ${postOpDto.bleeding}` : ''}: ${postOpDto.notes || 'Routine post-op assessment'}`,
    });
  }
}