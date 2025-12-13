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
import { FollowUpsService } from './follow-ups.service';
import {
  FollowUpVisitDto,
  CreateFollowUpVisitDto,
  UpdateFollowUpVisitDto,
  GenerateFollowUpScheduleDto,
} from './dto/follow-up-visit.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Follow-up Visits')
@ApiBearerAuth()
@Controller('follow-ups')
@UseGuards(JwtAuthGuard)
export class FollowUpsController {
  constructor(private readonly service: FollowUpsService) {}

  @Post('generate-schedule')
  @ApiOperation({ summary: 'Generate 14-visit follow-up schedule for a patient' })
  @ApiResponse({ status: 201, description: 'Schedule generated successfully' })
  @ApiResponse({ status: 409, description: 'Schedule already exists' })
  async generateSchedule(@Body() dto: GenerateFollowUpScheduleDto) {
    return this.service.generateSchedule(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Create individual follow-up visit' })
  @ApiResponse({ status: 201, description: 'Follow-up visit created', type: FollowUpVisitDto })
  @ApiResponse({ status: 409, description: 'Visit number already exists' })
  async create(@Body() createDto: CreateFollowUpVisitDto): Promise<FollowUpVisitDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all follow-up visits' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, type: [FollowUpVisitDto] })
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
  ): Promise<FollowUpVisitDto[]> {
    return this.service.findAll(patientId, status);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all follow-up visits for a patient' })
  @ApiResponse({ status: 200, type: [FollowUpVisitDto] })
  async findByPatient(@Param('patientId') patientId: string): Promise<FollowUpVisitDto[]> {
    return this.service.findByPatient(patientId);
  }

  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get follow-up summary for a patient' })
  @ApiResponse({ status: 200, description: 'Returns follow-up statistics and upcoming visits' })
  async getPatientSummary(@Param('patientId') patientId: string) {
    return this.service.getPatientFollowUpSummary(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get follow-up visit by ID' })
  @ApiResponse({ status: 200, type: FollowUpVisitDto })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async findOne(@Param('id') id: string): Promise<FollowUpVisitDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update follow-up visit' })
  @ApiResponse({ status: 200, type: FollowUpVisitDto })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateFollowUpVisitDto,
  ): Promise<FollowUpVisitDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete follow-up visit' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404, description: 'Visit not found' })
  async remove(@Param('id') id: string): Promise<FollowUpVisitDto> {
    return this.service.remove(id);
  }
}
