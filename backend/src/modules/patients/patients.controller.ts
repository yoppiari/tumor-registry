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
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Gender, BloodType, MaritalStatus } from '@prisma/client';

@ApiTags('Patients')
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all patients with pagination and search' })
  @ApiResponse({ status: 200, description: 'Patients retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, NIK, MRN, or phone' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('centerId') centerId?: string,
    @Query('search') search?: string,
    @Query('includeInactive') includeInactive?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return await this.patientsService.findAll(
      centerId,
      includeInactive === 'true',
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
      search,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Advanced patient search with filters' })
  @ApiResponse({ status: 200, description: 'Patients searched successfully' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'centerId', required: false })
  @ApiQuery({ name: 'gender', required: false, enum: Gender })
  @ApiQuery({ name: 'bloodType', required: false, enum: BloodType })
  @ApiQuery({ name: 'maritalStatus', required: false, enum: MaritalStatus })
  @ApiQuery({ name: 'isDeceased', required: false, type: Boolean })
  @ApiQuery({ name: 'dateOfBirthFrom', required: false })
  @ApiQuery({ name: 'dateOfBirthTo', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchPatients(@Query() searchQuery: any) {
    return await this.patientsService.searchPatients(searchQuery);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get patient statistics' })
  @ApiResponse({ status: 200, description: 'Patient statistics retrieved successfully' })
  @ApiQuery({ name: 'centerId', required: false, description: 'Filter by center ID' })
  async getStatistics(@Query('centerId') centerId?: string) {
    return await this.patientsService.getPatientStatistics(centerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiQuery({ name: 'includeMedicalHistory', required: false, type: Boolean })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeMedicalHistory') includeMedicalHistory?: string,
  ) {
    const include = includeMedicalHistory === 'true';
    return await this.patientsService.findById(id, include);
  }

  @Get('nik/:nik')
  @ApiOperation({ summary: 'Get patient by NIK' })
  @ApiParam({ name: 'nik', description: 'Patient NIK' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByNIK(@Param('nik') nik: string) {
    return await this.patientsService.findByNIK(nik);
  }

  @Get('mrn/:mrn')
  @ApiOperation({ summary: 'Get patient by Medical Record Number' })
  @ApiParam({ name: 'mrn', description: 'Medical Record Number' })
  @ApiResponse({ status: 200, description: 'Patient retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async findByMRN(@Param('mrn') mrn: string) {
    return await this.patientsService.findByMedicalRecordNumber(mrn);
  }

  @Post()
  @ApiOperation({ summary: 'Create new patient' })
  @ApiResponse({ status: 201, description: 'Patient created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Patient already exists' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: {
    name: string;
    nik: string;
    dateOfBirth: string;
    placeOfBirth?: string;
    gender: Gender;
    bloodType?: BloodType;
    religion?: string;
    maritalStatus?: MaritalStatus;
    occupation?: string;
    education?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    province?: string;
    regency?: string;
    district?: string;
    village?: string;
    postalCode?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
    centerId: string;
  }) {
    return await this.patientsService.create({
      ...createPatientDto,
      dateOfBirth: new Date(createPatientDto.dateOfBirth),
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update patient information' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: {
      name?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
      province?: string;
      regency?: string;
      district?: string;
      village?: string;
      postalCode?: string;
      emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
      };
      bloodType?: BloodType;
      religion?: string;
      maritalStatus?: MaritalStatus;
      occupation?: string;
      education?: string;
      isActive?: boolean;
      isDeceased?: boolean;
      dateOfDeath?: string;
      causeOfDeath?: string;
    },
  ) {
    const data: any = { ...updatePatientDto };
    if (updatePatientDto.dateOfDeath) {
      data.dateOfDeath = new Date(updatePatientDto.dateOfDeath);
    }
    return await this.patientsService.update(id, data);
  }

  // Additional endpoints for quick data access

  @Get(':id/vital-signs')
  @ApiOperation({ summary: 'Get patient vital signs history' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async getPatientVitalSigns(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: string,
  ) {
    const patient = await this.patientsService.findById(id, true);
    return {
      patientId: id,
      patientName: patient.name,
      vitalSigns: patient.vitalSigns || [],
    };
  }

  @Get(':id/diagnoses')
  @ApiOperation({ summary: 'Get patient diagnoses history' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async getPatientDiagnoses(@Param('id', ParseUUIDPipe) id: string) {
    const patient = await this.patientsService.findById(id, true);
    return {
      patientId: id,
      patientName: patient.name,
      diagnoses: patient.diagnoses || [],
    };
  }

  @Get(':id/medications')
  @ApiOperation({ summary: 'Get patient medications' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async getPatientMedications(@Param('id', ParseUUIDPipe) id: string) {
    const patient = await this.patientsService.findById(id, true);
    return {
      patientId: id,
      patientName: patient.name,
      medications: patient.medications || [],
    };
  }

  @Get(':id/allergies')
  @ApiOperation({ summary: 'Get patient allergies' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async getPatientAllergies(@Param('id', ParseUUIDPipe) id: string) {
    const patient = await this.patientsService.findById(id, true);
    return {
      patientId: id,
      patientName: patient.name,
      allergies: patient.allergies || [],
    };
  }

  @Get(':id/visits')
  @ApiOperation({ summary: 'Get patient visits history' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async getPatientVisits(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: string,
  ) {
    const patient = await this.patientsService.findById(id, true);
    return {
      patientId: id,
      patientName: patient.name,
      visits: patient.visits || [],
    };
  }

  @Get(':id/insurance')
  @ApiOperation({ summary: 'Get patient insurance information' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  async getPatientInsurance(@Param('id', ParseUUIDPipe) id: string) {
    const patient = await this.patientsService.findById(id, true);
    return {
      patientId: id,
      patientName: patient.name,
      insuranceInfos: patient.insuranceInfos || [],
    };
  }
}