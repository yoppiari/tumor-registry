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
import { CpcService } from './cpc.service';
import { CpcConferenceDto, CreateCpcConferenceDto, UpdateCpcConferenceDto } from './dto/cpc-conference.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('CPC Conferences')
@ApiBearerAuth()
@Controller('cpc')
@UseGuards(JwtAuthGuard)
export class CpcController {
  constructor(private readonly service: CpcService) {}

  @Post()
  @ApiOperation({ summary: 'Create CPC conference record' })
  @ApiResponse({ status: 201, description: 'Conference created', type: CpcConferenceDto })
  async create(@Body() createDto: CreateCpcConferenceDto): Promise<CpcConferenceDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CPC conferences' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'recommendationType', required: false })
  @ApiResponse({ status: 200, type: [CpcConferenceDto] })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('recommendationType') recommendationType?: string,
  ): Promise<CpcConferenceDto[]> {
    return this.service.findAll(patientId, recommendationType);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent CPC conferences' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to look back (default: 30)' })
  @ApiResponse({ status: 200, description: 'Returns recent CPC conferences' })
  async getRecentConferences(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.service.getRecentConferences(daysNumber);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all CPC conferences for a patient' })
  @ApiResponse({ status: 200, type: [CpcConferenceDto] })
  async findByPatient(@Param('patientId') patientId: string): Promise<CpcConferenceDto[]> {
    return this.service.findByPatient(patientId);
  }

  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get CPC conference summary for a patient' })
  @ApiResponse({ status: 200, description: 'Returns CPC statistics and details' })
  async getPatientSummary(@Param('patientId') patientId: string) {
    return this.service.getPatientCpcSummary(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CPC conference by ID' })
  @ApiResponse({ status: 200, type: CpcConferenceDto })
  @ApiResponse({ status: 404, description: 'Conference not found' })
  async findOne(@Param('id') id: string): Promise<CpcConferenceDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update CPC conference' })
  @ApiResponse({ status: 200, type: CpcConferenceDto })
  @ApiResponse({ status: 404, description: 'Conference not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCpcConferenceDto,
  ): Promise<CpcConferenceDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete CPC conference' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Conference not found' })
  async remove(@Param('id') id: string): Promise<CpcConferenceDto> {
    return this.service.remove(id);
  }
}
