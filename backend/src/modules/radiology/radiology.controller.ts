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
import { RadiologyService } from './radiology.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { ImagingModality, ExamStatus, ContrastType, UrgencyLevel } from '@prisma/client';

@ApiTags('Radiology')
@Controller('radiology')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RadiologyController {
  constructor(private readonly radiologyService: RadiologyService) {}

  @Post('orders')
  @ApiOperation({ summary: 'Create new imaging order' })
  @ApiResponse({ status: 201, description: 'Imaging order created successfully' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_RADIOLOGY_ORDER')
  async createImagingOrder(@Body() createImagingOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    modality: ImagingModality;
    bodyPart: string;
    clinicalIndication?: string;
    contrastType?: ContrastType;
    urgency: UrgencyLevel;
    requestedDate: string;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      ...createImagingOrderDto,
      requestedDate: new Date(createImagingOrderDto.requestedDate),
    });
  }

  @Get('orders')
  @ApiOperation({ summary: 'Search imaging orders' })
  @ApiResponse({ status: 200, description: 'Imaging orders retrieved successfully' })
  @RequirePermissions('RADIOLOGY_READ')
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'modality', required: false, enum: ImagingModality })
  @ApiQuery({ name: 'status', required: false, enum: ExamStatus })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchImagingOrders(@Query() searchQuery: any) {
    const data: any = { ...searchQuery };
    if (searchQuery.dateFrom) {
      data.dateFrom = new Date(searchQuery.dateFrom);
    }
    if (searchQuery.dateTo) {
      data.dateTo = new Date(searchQuery.dateTo);
    }
    return await this.radiologyService.getImagingOrdersByPatient(
      searchQuery.patientId,
      data
    );
  }

  @Get('orders/pending')
  @ApiOperation({ summary: 'Get pending imaging studies' })
  @ApiResponse({ status: 200, description: 'Pending imaging studies retrieved successfully' })
  @RequirePermissions('RADIOLOGY_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getPendingStudies(@Query('centerId') centerId?: string) {
    return await this.radiologyService.getPendingStudies(centerId);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get imaging order by ID' })
  @ApiParam({ name: 'orderId', description: 'Imaging order ID' })
  @ApiResponse({ status: 200, description: 'Imaging order retrieved successfully' })
  @RequirePermissions('RADIOLOGY_READ')
  async getImagingOrderById(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return await this.radiologyService.getImagingOrderById(orderId);
  }

  @Put('orders/:orderId/status')
  @ApiOperation({ summary: 'Update imaging order status' })
  @ApiParam({ name: 'orderId', description: 'Imaging order ID' })
  @ApiResponse({ status: 200, description: 'Imaging order status updated successfully' })
  @RequirePermissions('RADIOLOGY_UPDATE')
  @AuditLog('UPDATE_RADIOLOGY_ORDER_STATUS')
  async updateImagingOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateData: {
      status: ExamStatus;
      updatedBy?: string;
      scheduledDate?: string;
    }
  ) {
    return await this.radiologyService.updateImagingOrderStatus(
      orderId,
      updateData.status,
      updateData.updatedBy,
      updateData.scheduledDate ? new Date(updateData.scheduledDate) : undefined
    );
  }

  @Put('orders/:orderId/report')
  @ApiOperation({ summary: 'Update radiology report' })
  @ApiParam({ name: 'orderId', description: 'Imaging order ID' })
  @ApiResponse({ status: 200, description: 'Radiology report updated successfully' })
  @RequirePermissions('RADIOLOGY_UPDATE')
  @AuditLog('UPDATE_RADIOLOGY_REPORT')
  async updateRadiologyReport(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() reportData: {
      findings?: string;
      impression?: string;
      recommendation?: string;
      radiologistId?: string;
      reportDate?: string;
      imagesCaptured?: number;
      contrastAdministered?: boolean;
      contrastAmount?: number;
      complications?: string;
      technique?: string;
      comparison?: string;
      biRadsScore?: number;
      notes?: string;
    }
  ) {
    const data: any = { ...reportData };
    if (reportData.reportDate) {
      data.reportDate = new Date(reportData.reportDate);
    }
    return await this.radiologyService.updateRadiologyReport(orderId, data);
  }

  @Get('orders/patient/:patientId')
  @ApiOperation({ summary: 'Get imaging orders by patient ID' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient imaging orders retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'modality', required: false, enum: ImagingModality })
  @ApiQuery({ name: 'status', required: false, enum: ExamStatus })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getImagingOrdersByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('modality') modality?: ImagingModality,
    @Query('status') status?: ExamStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.radiologyService.getImagingOrdersByPatient(
      patientId,
      {
        modality,
        status,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
      }
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get radiology statistics' })
  @ApiResponse({ status: 200, description: 'Radiology statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getRadiologyStatistics(
    @Query('centerId') centerId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.radiologyService.getRadiologyStatistics(
      centerId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    );
  }

  @Get('patient/:patientId/radiation-tracking')
  @ApiOperation({ summary: 'Get patient radiation dose tracking' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Radiation dose tracking retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  async getPatientRadiationTracking(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.radiologyService.getPatientRadiationDoseTracking(patientId);
  }

  // Imaging order templates for common scenarios

  @Post('templates/ct-chest-abdomen-pelvis')
  @ApiOperation({ summary: 'Create CT Chest/Abdomen/Pelvis order' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_CT_CAP_ORDER')
  async createCTCAPOrder(@Body() ctOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    contrastType?: ContrastType;
    clinicalIndication?: string;
    cancerStaging?: boolean;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      patientId: ctOrderDto.patientId,
      orderingPhysicianId: ctOrderDto.orderingPhysicianId,
      modality: 'CT',
      bodyPart: 'Chest/Abdomen/Pelvis',
      clinicalIndication: ctOrderDto.clinicalIndication || (ctOrderDto.cancerStaging ? 'Cancer staging' : 'Oncologic evaluation'),
      contrastType: ctOrderDto.contrastType || 'IV_CONTRAST',
      urgency: ctOrderDto.urgency,
      requestedDate: new Date(),
      notes: `CT CAP Order${ctOrderDto.cancerStaging ? ' (Cancer Staging)' : ''}: ${ctOrderDto.notes || 'Routine oncologic evaluation'}`,
    });
  }

  @Post('templates/ct-specific-area')
  @ApiOperation({ summary: 'Create CT of specific area order' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_CT_SPECIFIC_ORDER')
  async createCTSpecificOrder(@Body() ctOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    bodyPart: string;
    urgency: UrgencyLevel;
    contrastType?: ContrastType;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      patientId: ctOrderDto.patientId,
      orderingPhysicianId: ctOrderDto.orderingPhysicianId,
      modality: 'CT',
      bodyPart: ctOrderDto.bodyPart,
      clinicalIndication: ctOrderDto.clinicalIndication,
      contrastType: ctOrderDto.contrastType || 'NONE',
      urgency: ctOrderDto.urgency,
      requestedDate: new Date(),
      notes: `CT ${ctOrderDto.bodyPart} Order: ${ctOrderDto.notes || 'Targeted evaluation'}`,
    });
  }

  @Post('templates/mri-tumor-evaluation')
  @ApiOperation({ summary: 'Create MRI for tumor evaluation order' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_MRI_TUMOR_ORDER')
  async createMRITumorOrder(@Body() mriOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    bodyPart: string;
    urgency: UrgencyLevel;
    contrastType?: ContrastType;
    tumorType?: string;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      patientId: mriOrderDto.patientId,
      orderingPhysicianId: mriOrderDto.orderingPhysicianId,
      modality: 'MRI',
      bodyPart: mriOrderDto.bodyPart,
      clinicalIndication: mriOrderDto.clinicalIndication || `Tumor evaluation for ${mriOrderDto.tumorType || 'known malignancy'}`,
      contrastType: mriOrderDto.contrastType || 'IV_CONTRAST',
      urgency: mriOrderDto.urgency,
      requestedDate: new Date(),
      notes: `MRI ${mriOrderDto.bodyPart} Order${mriOrderDto.tumorType ? ` - ${mriOrderDto.tumorType}` : ''}: ${mriOrderDto.notes || 'Tumor characterization'}`,
    });
  }

  @Post('templates/pet-ct-staging')
  @ApiOperation({ summary: 'Create PET-CT for cancer staging order' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_PET_CT_ORDER')
  async createPETCTOrder(@Body() petOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    cancerType?: string;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      patientId: petOrderDto.patientId,
      orderingPhysicianId: petOrderDto.orderingPhysicianId,
      modality: 'PET_CT',
      bodyPart: 'Whole Body',
      clinicalIndication: petOrderDto.clinicalIndication || `PET-CT for ${petOrderDto.cancerType || 'oncologic evaluation'}`,
      contrastType: 'NONE',
      urgency: petOrderDto.urgency,
      requestedDate: new Date(),
      notes: `PET-CT Whole Body Order${petOrderDto.cancerType ? ` - ${petOrderDto.cancerType}` : ''}: ${petOrderDto.notes || 'Staging and treatment response'}`,
    });
  }

  @Post('templates/xray-chest')
  @ApiOperation({ summary: 'Create Chest X-Ray order' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_XRAY_CHEST_ORDER')
  async createXRayChestOrder(@Body() xrayOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      patientId: xrayOrderDto.patientId,
      orderingPhysicianId: xrayOrderDto.orderingPhysicianId,
      modality: 'XRAY',
      bodyPart: 'Chest',
      clinicalIndication: xrayOrderDto.clinicalIndication,
      contrastType: 'NONE',
      urgency: xrayOrderDto.urgency,
      requestedDate: new Date(),
      notes: `Chest X-Ray Order: ${xrayOrderDto.notes || 'Routine chest evaluation'}`,
    });
  }

  @Post('templates/ultrasound-abdomen')
  @ApiOperation({ summary: 'Create Abdominal Ultrasound order' })
  @RequirePermissions('RADIOLOGY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_ULTRASOUND_ABDOMEN_ORDER')
  async createUltrasoundAbdomenOrder(@Body() usOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.radiologyService.createImagingOrder({
      patientId: usOrderDto.patientId,
      orderingPhysicianId: usOrderDto.orderingPhysicianId,
      modality: 'ULTRASOUND',
      bodyPart: 'Abdomen',
      clinicalIndication: usOrderDto.clinicalIndication,
      contrastType: 'NONE',
      urgency: usOrderDto.urgency,
      requestedDate: new Date(),
      notes: `Abdominal Ultrasound Order: ${usOrderDto.notes || 'Abdominal organ evaluation'}`,
    });
  }
}