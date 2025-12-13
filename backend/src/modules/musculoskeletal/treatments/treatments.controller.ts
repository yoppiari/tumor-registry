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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TreatmentsService } from './treatments.service';
import { TreatmentManagementDto, CreateTreatmentDto, UpdateTreatmentDto } from './dto/treatment.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Treatment Management')
@ApiBearerAuth()
@Controller('treatments')
@UseGuards(JwtAuthGuard)
export class TreatmentsController {
  constructor(private readonly service: TreatmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create treatment record' })
  @ApiResponse({ status: 201, description: 'Treatment created', type: TreatmentManagementDto })
  async create(@Body() createDto: CreateTreatmentDto): Promise<TreatmentManagementDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all treatments' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'treatmentType', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, type: [TreatmentManagementDto] })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('treatmentType') treatmentType?: string,
    @Query('status') status?: string,
  ): Promise<TreatmentManagementDto[]> {
    return this.service.findAll(patientId, treatmentType, status);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all treatments for a patient' })
  @ApiResponse({ status: 200, type: [TreatmentManagementDto] })
  async findByPatient(@Param('patientId') patientId: string): Promise<TreatmentManagementDto[]> {
    return this.service.findByPatient(patientId);
  }

  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get treatment summary for a patient' })
  @ApiResponse({ status: 200, description: 'Returns treatment statistics and details' })
  async getPatientSummary(@Param('patientId') patientId: string) {
    return this.service.getPatientTreatmentSummary(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get treatment by ID' })
  @ApiResponse({ status: 200, type: TreatmentManagementDto })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  async findOne(@Param('id') id: string): Promise<TreatmentManagementDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update treatment' })
  @ApiResponse({ status: 200, type: TreatmentManagementDto })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTreatmentDto,
  ): Promise<TreatmentManagementDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete treatment' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Treatment not found' })
  async remove(@Param('id') id: string): Promise<TreatmentManagementDto> {
    return this.service.remove(id);
  }
}
