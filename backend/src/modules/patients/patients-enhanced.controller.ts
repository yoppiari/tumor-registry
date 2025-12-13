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
import { PatientsEnhancedService } from './patients-enhanced.service';
import { CreatePatientDto, UpdatePatientDto, PatientDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsEnhancedController {
  constructor(private readonly patientsService: PatientsEnhancedService) {}

  @Post()
  @ApiOperation({ summary: 'Create new patient with musculoskeletal tumor data' })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Patient with NIK or MRN already exists' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreatePatientDto): Promise<PatientDto> {
    return this.patientsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Patients retrieved successfully',
  })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  @ApiQuery({
    name: 'pathologyType',
    required: false,
    description: 'Filter by pathology type',
    enum: ['bone_tumor', 'soft_tissue_tumor', 'metastatic_bone_disease'],
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, NIK, MRN, or phone' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, description: 'Include inactive patients' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 50)' })
  async findAll(
    @Query('centerId') centerId?: string,
    @Query('pathologyType') pathologyType?: string,
    @Query('search') search?: string,
    @Query('includeInactive') includeInactive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientsService.findAll(
      centerId,
      pathologyType,
      includeInactive === 'true',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      search,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Advanced patient search with multiple filters' })
  @ApiResponse({ status: 200, description: 'Patients searched successfully' })
  @ApiQuery({ name: 'search', required: false, description: 'Search text' })
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'pathologyType', required: false })
  @ApiQuery({ name: 'gender', required: false, enum: ['MALE', 'FEMALE'] })
  @ApiQuery({ name: 'ennekingStage', required: false })
  @ApiQuery({ name: 'ajccStage', required: false })
  @ApiQuery({ name: 'isDeceased', required: false, type: Boolean })
  @ApiQuery({ name: 'metastasisPresent', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchPatients(@Query() searchQuery: any) {
    return this.patientsService.searchPatients(searchQuery);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get patient statistics for center or system-wide' })
  @ApiResponse({ status: 200, description: 'Patient statistics retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID (omit for system-wide)' })
  async getStatistics(@Query('centerId') centerId?: string) {
    return this.patientsService.getPatientStatistics(centerId);
  }

  @Get('nik/:nik')
  @ApiOperation({ summary: 'Get patient by Indonesian National ID (NIK)' })
  @ApiParam({ name: 'nik', description: '16-digit Indonesian National ID', example: '3173051234567890' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully', type: PatientDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByNIK(@Param('nik') nik: string): Promise<PatientDto> {
    return this.patientsService.findByNIK(nik);
  }

  @Get('mrn/:mrn')
  @ApiOperation({ summary: 'Get patient by Medical Record Number' })
  @ApiParam({ name: 'mrn', description: 'Medical Record Number', example: 'MR-2025-00001' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully', type: PatientDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByMRN(@Param('mrn') mrn: string): Promise<PatientDto> {
    return this.patientsService.findByMRN(mrn);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get comprehensive patient summary with all musculoskeletal data' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({
    status: 200,
    description: 'Patient summary retrieved successfully with diagnosis, clinical data, MSTS scores, follow-ups, treatments, and CPC conferences',
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async getPatientSummary(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.getPatientSummary(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully', type: PatientDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiQuery({
    name: 'includeFullHistory',
    required: false,
    type: Boolean,
    description: 'Include all MSTS scores, follow-ups, treatments, and CPC conferences',
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeFullHistory') includeFullHistory?: string,
  ): Promise<PatientDto> {
    const include = includeFullHistory === 'true';
    return this.patientsService.findById(id, include);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient information' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully', type: PatientDto })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePatientDto,
  ): Promise<PatientDto> {
    return this.patientsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete patient (set isActive = false)' })
  @ApiParam({ name: 'id', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<PatientDto> {
    return this.patientsService.remove(id);
  }
}
