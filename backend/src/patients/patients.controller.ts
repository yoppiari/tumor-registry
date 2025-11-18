import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientSearchDto } from './dto/patient-search.dto';
import { QuickPatientEntryDto, ChatMessageDto } from './dto/quick-patient-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Patient } from './interfaces/patient.interface';

@ApiTags('patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Create new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully', type: Patient })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Patient already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Req() req: any, @Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    const userId = req.user.sub;
    return this.patientsService.create(createPatientDto, userId);
  }

  @Post('quick-entry')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Quick patient entry (WhatsApp-inspired)' })
  @ApiResponse({ status: 201, description: 'Patient created successfully', type: Patient })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async quickEntry(@Req() req: any, @Body() quickEntryDto: QuickPatientEntryDto): Promise<Patient> {
    const userId = req.user.sub;
    return this.patientsService.quickEntry(quickEntryDto, userId);
  }

  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  @ApiOperation({ summary: 'Search patients with filters' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'medicalRecordNumber', required: false, description: 'Medical record number' })
  @ApiQuery({ name: 'name', required: false, description: 'Patient name' })
  @ApiQuery({ name: 'cancerStage', required: false, description: 'Cancer stage' })
  @ApiQuery({ name: 'treatmentStatus', required: false, description: 'Treatment status' })
  @ApiQuery({ name: 'primarySite', required: false, description: 'Primary cancer site' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Query() searchDto: PatientSearchDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    return this.patientsService.findAll({
      ...searchDto,
      page,
      limit,
      sortBy: sortBy as any,
      sortOrder: sortOrder || 'desc'
    });
  }

  @Get('statistics')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get patient statistics' })
  @ApiResponse({ status: 200, description: 'Patient statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async getStatistics() {
    return this.patientsService.getStatistics();
  }

  @Get('mrn/:medicalRecordNumber')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get patient by medical record number' })
  @ApiParam({ name: 'medicalRecordNumber', description: 'Medical record number' })
  @ApiResponse({ status: 200, description: 'Patient found', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findByMedicalRecordNumber(@Param('medicalRecordNumber') medicalRecordNumber: string): Promise<Patient> {
    return this.patientsService.findByMedicalRecordNumber(medicalRecordNumber);
  }

  @Get(':id')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient found', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientsService.findById(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Update patient information' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully', type: Patient })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const userId = req.user.sub;
    return this.patientsService.update(id, updatePatientDto, userId);
  }

  @Patch(':id/deceased')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Mark patient as deceased' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient marked as deceased' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 400, description: 'Patient already deceased' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAsDeceased(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { dateOfDeath: string; causeOfDeath?: string }
  ): Promise<Patient> {
    const userId = req.user.sub;
    return this.patientsService.markAsDeceased(
      id,
      new Date(body.dateOfDeath),
      body.causeOfDeath,
      userId
    );
  }

  @Patch(':id/soft-delete')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Soft delete patient (deactivate)' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('admin', 'national_stakeholder')
  async softDelete(@Param('id') id: string): Promise<void> {
    return this.patientsService.softDelete(id);
  }

  // WhatsApp-inspired Chat API
  @Post('chat/session')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Create patient entry chat session' })
  @ApiResponse({ status: 201, description: 'Chat session created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createChatSession(@Req() req: any) {
    const userId = req.user.sub;
    return this.patientsService.createEntrySession(userId);
  }

  @Post('chat/:sessionId/message')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Send message in patient entry chat' })
  @ApiParam({ name: 'sessionId', description: 'Chat session ID' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendChatMessage(
    @Param('sessionId') sessionId: string,
    @Body() chatMessageDto: ChatMessageDto
  ) {
    return this.patientsService.updateSession(
      sessionId,
      chatMessageDto.content,
      chatMessageDto.fieldName
    );
  }

  @Get('chat/:sessionId')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get chat session' })
  @ApiParam({ name: 'sessionId', description: 'Chat session ID' })
  @ApiResponse({ status: 200, description: 'Chat session retrieved' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getChatSession(@Param('sessionId') sessionId: string) {
    return this.patientsService.getSession(sessionId);
  }

  // Advanced search endpoints
  @Get('search/advanced')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Advanced patient search' })
  @ApiQuery({ name: 'dateOfBirthFrom', required: false, description: 'Date of birth from' })
  @ApiQuery({ name: 'dateOfBirthTo', required: false, description: 'Date of birth to' })
  @ApiQuery({ name: 'dateOfDiagnosisFrom', required: false, description: 'Date of diagnosis from' })
  @ApiQuery({ name: 'dateOfDiagnosisTo', required: false, description: 'Date of diagnosis to' })
  @ApiQuery({ name: 'isDeceased', required: false, description: 'Filter deceased patients' })
  @ApiQuery({ name: 'treatmentCenter', required: false, description: 'Filter by treatment center' })
  @ApiResponse({ status: 200, description: 'Advanced search results' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async advancedSearch(@Query() advancedSearchDto: any) {
    return this.patientsService.findAll(advancedSearchDto);
  }

  @Get('search/by-phone/:phone')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Search patients by phone number' })
  @ApiParam({ name: 'phone', description: 'Phone number' })
  @ApiResponse({ status: 200, description: 'Patients found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchByPhone(@Param('phone') phone: string) {
    return this.patientsService.findAll({ phone });
  }

  @Get('search/by-name/:name')
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  @ApiOperation({ summary: 'Search patients by name' })
  @ApiParam({ name: 'name', description: 'Patient name' })
  @ApiResponse({ status: 200, description: 'Patients found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async searchByName(@Param('name') name: string) {
    return this.patients.service.findAll({ name });
  }

  // Export endpoints
  @Get('export/csv')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Export patients to CSV' })
  @ApiResponse({ status: 200, description: 'CSV export generated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Roles('researcher', 'admin', 'national_stakeholder')
  async exportToCsv(@Query() searchDto: PatientSearchDto) {
    // Implementation would generate CSV and return download URL
    // For now, return the data that would be exported
    const result = await this.patientsService.findAll(searchDto);
    return {
      downloadUrl: '/api/v1/patients/downloads/patients.csv',
      recordCount: result.total,
      generatedAt: new Date().toISOString()
    };
  }
}