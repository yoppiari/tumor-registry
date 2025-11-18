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
import { LaboratoryService } from './laboratory.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { LabTestType, LabTestStatus, SpecimenType, UrgencyLevel } from '@prisma/client';

@ApiTags('Laboratory')
@Controller('laboratory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post('orders')
  @ApiOperation({ summary: 'Create new lab test order' })
  @ApiResponse({ status: 201, description: 'Lab order created successfully' })
  @RequirePermissions('LABORATORY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_LAB_ORDER')
  async createLabOrder(@Body() createLabOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    testType: LabTestType;
    specimenType: SpecimenType;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    requestedDate: string;
    notes?: string;
  }) {
    return await this.laboratoryService.createLabOrder({
      ...createLabOrderDto,
      requestedDate: new Date(createLabOrderDto.requestedDate),
    });
  }

  @Get('orders')
  @ApiOperation({ summary: 'Search lab orders' })
  @ApiResponse({ status: 200, description: 'Lab orders retrieved successfully' })
  @RequirePermissions('LABORATORY_READ')
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'testType', required: false, enum: LabTestType })
  @ApiQuery({ name: 'status', required: false, enum: LabTestStatus })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchLabOrders(@Query() searchQuery: any) {
    const data: any = { ...searchQuery };
    if (searchQuery.dateFrom) {
      data.dateFrom = new Date(searchQuery.dateFrom);
    }
    if (searchQuery.dateTo) {
      data.dateTo = new Date(searchQuery.dateTo);
    }
    return await this.laboratoryService.getLabOrdersByPatient(
      searchQuery.patientId,
      data
    );
  }

  @Get('orders/pending')
  @ApiOperation({ summary: 'Get pending lab orders' })
  @ApiResponse({ status: 200, description: 'Pending lab orders retrieved successfully' })
  @RequirePermissions('LABORATORY_READ')
  @ApiQuery({ name: 'centerId', required: false })
  async getPendingOrders(@Query('centerId') centerId?: string) {
    return await this.laboratoryService.getPendingOrders(centerId);
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get lab order by ID' })
  @ApiParam({ name: 'orderId', description: 'Lab order ID' })
  @ApiResponse({ status: 200, description: 'Lab order retrieved successfully' })
  @RequirePermissions('LABORATORY_READ')
  async getLabOrderById(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return await this.laboratoryService.getLabOrderById(orderId);
  }

  @Put('orders/:orderId/status')
  @ApiOperation({ summary: 'Update lab order status' })
  @ApiParam({ name: 'orderId', description: 'Lab order ID' })
  @ApiResponse({ status: 200, description: 'Lab order status updated successfully' })
  @RequirePermissions('LABORATORY_UPDATE')
  @AuditLog('UPDATE_LAB_ORDER_STATUS')
  async updateLabOrderStatus(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() updateData: {
      status: LabTestStatus;
      updatedBy?: string;
    }
  ) {
    return await this.laboratoryService.updateLabOrderStatus(
      orderId,
      updateData.status,
      updateData.updatedBy
    );
  }

  @Put('orders/:orderId/result')
  @ApiOperation({ summary: 'Update lab test result' })
  @ApiParam({ name: 'orderId', description: 'Lab order ID' })
  @ApiResponse({ status: 200, description: 'Lab result updated successfully' })
  @RequirePermissions('LABORATORY_UPDATE')
  @AuditLog('UPDATE_LAB_RESULT')
  async updateLabResult(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() resultData: {
      result?: string;
      numericalResult?: number;
      unit?: string;
      referenceRange?: string;
      interpretation?: string;
      flaggedAsAbnormal?: boolean;
      performedBy?: string;
      performedAt?: string;
      verifiedBy?: string;
      verifiedAt?: string;
      notes?: string;
    }
  ) {
    const data: any = { ...resultData };
    if (resultData.performedAt) {
      data.performedAt = new Date(resultData.performedAt);
    }
    if (resultData.verifiedAt) {
      data.verifiedAt = new Date(resultData.verifiedAt);
    }
    return await this.laboratoryService.updateLabResult(orderId, data);
  }

  @Get('orders/patient/:patientId')
  @ApiOperation({ summary: 'Get lab orders by patient ID' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient lab orders retrieved successfully' })
  @RequirePermissions('PATIENTS_READ')
  @ApiQuery({ name: 'testType', required: false, enum: LabTestType })
  @ApiQuery({ name: 'status', required: false, enum: LabTestStatus })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLabOrdersByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('testType') testType?: LabTestType,
    @Query('status') status?: LabTestStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.laboratoryService.getLabOrdersByPatient(
      patientId,
      {
        testType,
        status,
        dateFrom: dateFrom ? new Date(dateFrom) : undefined,
        dateTo: dateTo ? new Date(dateTo) : undefined,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
      }
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get laboratory statistics' })
  @ApiResponse({ status: 200, description: 'Laboratory statistics retrieved successfully' })
  @RequirePermissions('ANALYTICS_VIEW')
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  async getLabStatistics(
    @Query('centerId') centerId?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return await this.laboratoryService.getLabStatistics(
      centerId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined
    );
  }

  // Lab order templates for common scenarios

  @Post('templates/complete-blood-count')
  @ApiOperation({ summary: 'Create Complete Blood Count order' })
  @RequirePermissions('LABORATORY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_CBC_ORDER')
  async createCBCOrder(@Body() cbcOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.laboratoryService.createLabOrder({
      patientId: cbcOrderDto.patientId,
      orderingPhysicianId: cbcOrderDto.orderingPhysicianId,
      testType: 'COMPLETE_BLOOD_COUNT',
      specimenType: 'BLOOD',
      urgency: cbcOrderDto.urgency,
      clinicalIndication: cbcOrderDto.clinicalIndication,
      requestedDate: new Date(),
      notes: `CBC Order: ${cbcOrderDto.notes || 'Routine complete blood count'}`,
    });
  }

  @Post('templates/comprehensive-metabolic-panel')
  @ApiOperation({ summary: 'Create Comprehensive Metabolic Panel order' })
  @RequirePermissions('LABORATORY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_CMP_ORDER')
  async createCMPOrder(@Body() cmpOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.laboratoryService.createLabOrder({
      patientId: cmpOrderDto.patientId,
      orderingPhysicianId: cmpOrderDto.orderingPhysicianId,
      testType: 'COMPREHENSIVE_METABOLIC_PANEL',
      specimenType: 'BLOOD',
      urgency: cmpOrderDto.urgency,
      clinicalIndication: cmpOrderDto.clinicalIndication,
      requestedDate: new Date(),
      notes: `CMP Order: ${cmpOrderDto.notes || 'Routine comprehensive metabolic panel'}`,
    });
  }

  @Post('templates/liver-function-tests')
  @ApiOperation({ summary: 'Create Liver Function Tests order' })
  @RequirePermissions('LABORATORY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_LFT_ORDER')
  async createLFTOrder(@Body() lftOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.laboratoryService.createLabOrder({
      patientId: lftOrderDto.patientId,
      orderingPhysicianId: lftOrderDto.orderingPhysicianId,
      testType: 'LIVER_FUNCTION_TESTS',
      specimenType: 'BLOOD',
      urgency: lftOrderDto.urgency,
      clinicalIndication: lftOrderDto.clinicalIndication,
      requestedDate: new Date(),
      notes: `LFT Order: ${lftOrderDto.notes || 'Liver function assessment'}`,
    });
  }

  @Post('templates/tumor-markers')
  @ApiOperation({ summary: 'Create Tumor Markers panel order' })
  @RequirePermissions('LABORATORY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_TUMOR_MARKERS_ORDER')
  async createTumorMarkersOrder(@Body() tumorMarkersDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    cancerType?: string;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.laboratoryService.createLabOrder({
      patientId: tumorMarkersDto.patientId,
      orderingPhysicianId: tumorMarkersDto.orderingPhysicianId,
      testType: 'TISSUE_MARKERS',
      specimenType: 'BLOOD',
      urgency: tumorMarkersDto.urgency,
      clinicalIndication: tumorMarkersDto.clinicalIndication || `Tumor marker assessment for ${tumorMarkersDto.cancerType || 'cancer surveillance'}`,
      requestedDate: new Date(),
      notes: `Tumor Markers Order${tumorMarkersDto.cancerType ? ` - ${tumorMarkersDto.cancerType}` : ''}: ${tumorMarkersDto.notes || 'Cancer surveillance'}`,
    });
  }

  @Post('templates/coagulation-profile')
  @ApiOperation({ summary: 'Create Coagulation Profile order' })
  @RequirePermissions('LABORATORY_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_COAGULATION_ORDER')
  async createCoagulationOrder(@Body() coagOrderDto: {
    patientId: string;
    orderingPhysicianId: string;
    urgency: UrgencyLevel;
    clinicalIndication?: string;
    notes?: string;
  }) {
    return await this.laboratoryService.createLabOrder({
      patientId: coagOrderDto.patientId,
      orderingPhysicianId: coagOrderDto.orderingPhysicianId,
      testType: 'COAGULATION_PROFILE',
      specimenType: 'BLOOD',
      urgency: coagOrderDto.urgency,
      clinicalIndication: coagOrderDto.clinicalIndication,
      requestedDate: new Date(),
      notes: `Coagulation Profile Order: ${coagOrderDto.notes || 'Bleeding assessment before procedure'}`,
    });
  }
}