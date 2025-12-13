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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LaboratoryService } from './laboratory.service';
import { CreateLabResultDto, UpdateLabResultDto, LabTestType, LabResultStatus } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Laboratory')
@ApiBearerAuth()
@Controller('laboratory')
@UseGuards(JwtAuthGuard)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create new laboratory result' })
  @ApiResponse({
    status: 201,
    description: 'Lab result created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateLabResultDto) {
    return this.laboratoryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all laboratory results with filters' })
  @ApiResponse({
    status: 200,
    description: 'Lab results retrieved successfully',
  })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
  @ApiQuery({
    name: 'testType',
    required: false,
    description: 'Filter by test type',
    enum: LabTestType,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    enum: LabResultStatus,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 50)' })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('testType') testType?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.laboratoryService.findAll(
      patientId,
      testType,
      status,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get laboratory statistics' })
  @ApiResponse({ status: 200, description: 'Lab statistics retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  async getStatistics(@Query('centerId') centerId?: string) {
    return this.laboratoryService.getStatistics(centerId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all lab results for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Lab results retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiQuery({
    name: 'testType',
    required: false,
    description: 'Filter by test type',
    enum: LabTestType,
  })
  async findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('testType') testType?: string,
  ) {
    return this.laboratoryService.findByPatient(patientId, testType);
  }

  @Get('patient/:patientId/tumor-markers')
  @ApiOperation({ summary: 'Get tumor markers for a patient with trends' })
  @ApiParam({ name: 'patientId', description: 'Patient UUID' })
  @ApiResponse({
    status: 200,
    description: 'Tumor markers retrieved successfully with trend analysis',
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getTumorMarkers(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.laboratoryService.getTumorMarkers(patientId);
  }

  @Get('patient/:patientId/abnormal')
  @ApiOperation({ summary: 'Get abnormal lab results for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Abnormal results retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getAbnormalResults(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.laboratoryService.getAbnormalResults(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab result by ID' })
  @ApiParam({ name: 'id', description: 'Lab result UUID' })
  @ApiResponse({ status: 200, description: 'Lab result retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratoryService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lab result' })
  @ApiParam({ name: 'id', description: 'Lab result UUID' })
  @ApiResponse({ status: 200, description: 'Lab result updated successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateLabResultDto,
  ) {
    return this.laboratoryService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lab result' })
  @ApiParam({ name: 'id', description: 'Lab result UUID' })
  @ApiResponse({ status: 200, description: 'Lab result deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lab result not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratoryService.delete(id);
  }

  // Musculoskeletal tumor-specific endpoints

  @Post('tumor-markers/batch')
  @ApiOperation({ summary: 'Create multiple tumor marker results at once' })
  @ApiResponse({ status: 201, description: 'Tumor markers created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @HttpCode(HttpStatus.CREATED)
  async createTumorMarkersBatch(@Body() createDtos: CreateLabResultDto[]) {
    const results = await Promise.all(
      createDtos.map(dto => this.laboratoryService.create(dto)),
    );
    return { results, count: results.length };
  }

  @Get('test-types/common')
  @ApiOperation({ summary: 'Get common lab test types for musculoskeletal tumors' })
  @ApiResponse({ status: 200, description: 'Common test types retrieved' })
  async getCommonTestTypes() {
    return {
      tumorMarkers: [
        {
          name: 'Alkaline Phosphatase (ALP)',
          normalRange: '30-120 U/L',
          unit: 'U/L',
          indication: 'Elevated in bone tumors, osteosarcoma',
        },
        {
          name: 'Lactate Dehydrogenase (LDH)',
          normalRange: '140-280 U/L',
          unit: 'U/L',
          indication: 'Prognostic marker for Ewing sarcoma',
        },
        {
          name: 'CA 19-9',
          normalRange: '0-37 U/mL',
          unit: 'U/mL',
          indication: 'Some soft tissue sarcomas',
        },
      ],
      cbcTests: [
        {
          name: 'Hemoglobin (Hb)',
          normalRange: '12-16 g/dL (F), 13-17 g/dL (M)',
          unit: 'g/dL',
          indication: 'Anemia assessment',
        },
        {
          name: 'White Blood Cell (WBC)',
          normalRange: '4,000-11,000/μL',
          unit: '/μL',
          indication: 'Infection, chemotherapy monitoring',
        },
        {
          name: 'Platelet Count',
          normalRange: '150,000-450,000/μL',
          unit: '/μL',
          indication: 'Bleeding risk, chemotherapy monitoring',
        },
      ],
      chemistryTests: [
        {
          name: 'Calcium',
          normalRange: '8.5-10.5 mg/dL',
          unit: 'mg/dL',
          indication: 'Bone metabolism, metastasis',
        },
        {
          name: 'Phosphorus',
          normalRange: '2.5-4.5 mg/dL',
          unit: 'mg/dL',
          indication: 'Bone metabolism',
        },
        {
          name: 'Creatinine',
          normalRange: '0.6-1.2 mg/dL',
          unit: 'mg/dL',
          indication: 'Renal function (chemotherapy)',
        },
      ],
    };
  }
}
