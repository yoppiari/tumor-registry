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
import { PathologyService } from './pathology.service';
import { CreatePathologyReportDto, UpdatePathologyReportDto, PathologyStatus } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Pathology')
@ApiBearerAuth()
@Controller('pathology')
@UseGuards(JwtAuthGuard)
export class PathologyController {
  constructor(private readonly pathologyService: PathologyService) {}

  @Post()
  @ApiOperation({ summary: 'Create new pathology report' })
  @ApiResponse({
    status: 201,
    description: 'Pathology report created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Report number already exists' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreatePathologyReportDto) {
    return this.pathologyService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pathology reports with filters' })
  @ApiResponse({
    status: 200,
    description: 'Pathology reports retrieved successfully',
  })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    enum: PathologyStatus,
  })
  @ApiQuery({ name: 'isMalignant', required: false, type: Boolean, description: 'Filter by malignancy' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 50)' })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('isMalignant') isMalignant?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pathologyService.findAll(
      patientId,
      status,
      isMalignant === 'true' ? true : isMalignant === 'false' ? false : undefined,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get pathology statistics' })
  @ApiResponse({ status: 200, description: 'Pathology statistics retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  async getStatistics(@Query('centerId') centerId?: string) {
    return this.pathologyService.getStatistics(centerId);
  }

  @Get('report-number/:reportNumber')
  @ApiOperation({ summary: 'Get pathology report by report number' })
  @ApiParam({ name: 'reportNumber', description: 'Pathology report number' })
  @ApiResponse({ status: 200, description: 'Pathology report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Pathology report not found' })
  async findByReportNumber(@Param('reportNumber') reportNumber: string) {
    return this.pathologyService.findByReportNumber(reportNumber);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all pathology reports for a patient' })
  @ApiParam({ name: 'patientId', description: 'Patient UUID' })
  @ApiResponse({ status: 200, description: 'Pathology reports retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.pathologyService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pathology report by ID' })
  @ApiParam({ name: 'id', description: 'Pathology report UUID' })
  @ApiResponse({ status: 200, description: 'Pathology report retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Pathology report not found' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.pathologyService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pathology report' })
  @ApiParam({ name: 'id', description: 'Pathology report UUID' })
  @ApiResponse({ status: 200, description: 'Pathology report updated successfully' })
  @ApiResponse({ status: 404, description: 'Pathology report not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdatePathologyReportDto,
  ) {
    return this.pathologyService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pathology report' })
  @ApiParam({ name: 'id', description: 'Pathology report UUID' })
  @ApiResponse({ status: 200, description: 'Pathology report deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pathology report not found' })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.pathologyService.delete(id);
  }
}
