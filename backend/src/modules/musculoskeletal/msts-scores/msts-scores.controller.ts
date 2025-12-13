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
import { MstsScoresService } from './msts-scores.service';
import { MstsScoreDto, CreateMstsScoreDto, UpdateMstsScoreDto } from './dto/msts-score.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('MSTS Scores')
@ApiBearerAuth()
@Controller('msts-scores')
@UseGuards(JwtAuthGuard)
export class MstsScoresController {
  constructor(private readonly service: MstsScoresService) {}

  @Post()
  @ApiOperation({ summary: 'Create new MSTS score assessment' })
  @ApiResponse({ status: 201, description: 'MSTS score created', type: MstsScoreDto })
  @ApiResponse({ status: 400, description: 'Invalid score values' })
  async create(@Body() createDto: CreateMstsScoreDto): Promise<MstsScoreDto> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all MSTS scores' })
  @ApiQuery({ name: 'patientId', required: false, description: 'Filter by patient ID' })
  @ApiResponse({ status: 200, description: 'Returns MSTS scores', type: [MstsScoreDto] })
  async findAll(@Query('patientId') patientId?: string): Promise<MstsScoreDto[]> {
    return this.service.findAll(patientId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get MSTS scores for a patient' })
  @ApiResponse({ status: 200, description: 'Returns patient MSTS scores', type: [MstsScoreDto] })
  async findByPatient(@Param('patientId') patientId: string): Promise<MstsScoreDto[]> {
    return this.service.findByPatient(patientId);
  }

  @Get('patient/:patientId/history')
  @ApiOperation({ summary: 'Get MSTS score history and statistics for a patient' })
  @ApiResponse({ status: 200, description: 'Returns score history and statistics' })
  async getPatientHistory(@Param('patientId') patientId: string) {
    return this.service.getPatientScoreHistory(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get MSTS score by ID' })
  @ApiResponse({ status: 200, description: 'Returns MSTS score', type: MstsScoreDto })
  @ApiResponse({ status: 404, description: 'MSTS score not found' })
  async findOne(@Param('id') id: string): Promise<MstsScoreDto> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update MSTS score' })
  @ApiResponse({ status: 200, description: 'MSTS score updated', type: MstsScoreDto })
  @ApiResponse({ status: 404, description: 'MSTS score not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMstsScoreDto,
  ): Promise<MstsScoreDto> {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete MSTS score' })
  @ApiResponse({ status: 200, description: 'MSTS score deleted' })
  @ApiResponse({ status: 404, description: 'MSTS score not found' })
  async remove(@Param('id') id: string): Promise<MstsScoreDto> {
    return this.service.remove(id);
  }
}
