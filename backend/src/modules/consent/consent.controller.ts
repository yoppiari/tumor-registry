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
import { ConsentService } from './consent.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { ConsentType } from '@prisma/client';

@ApiTags('Patient Consent')
@Controller('consent')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient consent' })
  @ApiResponse({ status: 201, description: 'Consent created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or missing guardian information' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'consent')
  async createConsent(@Body() createConsentDto: {
    patientId: string;
    consentType: ConsentType;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id', // This should come from authenticated user
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get consents by patient ID' })
  @ApiResponse({ status: 200, description: 'Consents retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'patientId', required: true })
  @ApiQuery({ name: 'consentType', required: false, enum: ConsentType })
  @ApiQuery({ name: 'includeExpired', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByPatientId(
    @Query('patientId') patientId: string,
    @Query('consentType') consentType?: ConsentType,
    @Query('includeExpired') includeExpired?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.consentService.findByPatientId(
      patientId,
      consentType,
      includeExpired === 'true',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get consent statistics' })
  @ApiResponse({ status: 200, description: 'Consent statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  async getStatistics(@Query('centerId') centerId?: string) {
    return await this.consentService.getConsentStatistics(centerId);
  }

  @Get('expiring')
  @ApiOperation({ summary: 'Get consents that will expire soon' })
  @ApiResponse({ status: 200, description: 'Expiring consents retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Days until expiry (default: 30)' })
  @ApiQuery({ name: 'centerId', required: false })
  async getExpiringConsents(
    @Query('days') days?: string,
    @Query('centerId') centerId?: string,
  ) {
    return await this.consentService.getExpiringConsents(
      days ? parseInt(days) : 30,
      centerId
    );
  }

  @Get('check')
  @ApiOperation({ summary: 'Check if patient has active consent for specific type' })
  @ApiResponse({ status: 200, description: 'Consent check completed successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'patientId', required: true })
  @ApiQuery({ name: 'consentType', required: true, enum: ConsentType })
  @ApiQuery({ name: 'requireActive', required: false, type: Boolean })
  async checkConsent(
    @Query('patientId') patientId: string,
    @Query('consentType') consentType: ConsentType,
    @Query('requireActive') requireActive?: string,
  ) {
    return await this.consentService.checkConsent(
      patientId,
      consentType,
      requireActive !== 'false'
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consent by ID' })
  @ApiParam({ name: 'id', description: 'Consent ID' })
  @ApiResponse({ status: 200, description: 'Consent retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @RequirePermissions('PATIENTS_READ')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.consentService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update consent' })
  @ApiParam({ name: 'id', description: 'Consent ID' })
  @ApiResponse({ status: 200, description: 'Consent updated successfully' })
  @ApiResponse({ status: 404, description: 'Consent not found' })
  @RequirePermissions('PATIENTS_UPDATE')
  @AuditLog('UPDATE', 'consent')
  async updateConsent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateConsentDto: {
      description?: string;
      isConsented?: boolean;
      consentDate?: string;
      expiredDate?: string;
      guardianName?: string;
      guardianRelation?: string;
      notes?: string;
    },
  ) {
    const data: any = { ...updateConsentDto };
    if (updateConsentDto.consentDate) {
      data.consentDate = new Date(updateConsentDto.consentDate);
    }
    if (updateConsentDto.expiredDate) {
      data.expiredDate = new Date(updateConsentDto.expiredDate);
    }
    return await this.consentService.updateConsent(id, data, 'current-user-id');
  }

  @Post(':id/revoke')
  @ApiOperation({ summary: 'Revoke consent' })
  @ApiParam({ name: 'id', description: 'Consent ID' })
  @ApiResponse({ status: 200, description: 'Consent revoked successfully' })
  @ApiResponse({ status: 400, description: 'Consent is already revoked' })
  @RequirePermissions('PATIENTS_UPDATE')
  @AuditLog('REVOKE', 'consent')
  async revokeConsent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    return await this.consentService.revokeConsent(id, reason, 'current-user-id');
  }

  // Quick consent templates

  @Post('templates/treatment')
  @ApiOperation({ summary: 'Create treatment consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'treatment_consent')
  async createTreatmentConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'TREATMENT',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/surgery')
  @ApiOperation({ summary: 'Create surgery consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'surgery_consent')
  async createSurgeryConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'SURGERY',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/anesthesia')
  @ApiOperation({ summary: 'Create anesthesia consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'anesthesia_consent')
  async createAnesthesiaConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'ANESTHESIA',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/blood-transfusion')
  @ApiOperation({ summary: 'Create blood transfusion consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'blood_transfusion_consent')
  async createBloodTransfusionConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'BLOOD_TRANSFUSION',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/research')
  @ApiOperation({ summary: 'Create research consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'research_consent')
  async createResearchConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'RESEARCH',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/photography')
  @ApiOperation({ summary: 'Create photography consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'photography_consent')
  async createPhotographyConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'PHOTOGRAPHY',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/telehealth')
  @ApiOperation({ summary: 'Create telehealth consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'telehealth_consent')
  async createTelehealthConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'TELEHEALTH',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }

  @Post('templates/privacy')
  @ApiOperation({ summary: 'Create privacy consent template' })
  @RequirePermissions('PATIENTS_UPDATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'privacy_consent')
  async createPrivacyConsent(@Body() createConsentDto: {
    patientId: string;
    description: string;
    isConsented: boolean;
    consentDate: string;
    expiredDate?: string;
    guardianName?: string;
    guardianRelation?: string;
    notes?: string;
  }) {
    return await this.consentService.createConsent({
      ...createConsentDto,
      consentType: 'PRIVACY',
      consentDate: new Date(createConsentDto.consentDate),
      expiredDate: createConsentDto.expiredDate ? new Date(createConsentDto.expiredDate) : undefined,
      providerId: 'current-user-id',
    });
  }
}