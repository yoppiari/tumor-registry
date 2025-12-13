import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TumorSyndromesService } from './tumor-syndromes.service';
import { TumorSyndromeDto, CreateTumorSyndromeDto } from './dto/tumor-syndrome.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Tumor Syndromes')
@ApiBearerAuth()
@Controller('tumor-syndromes')
@UseGuards(JwtAuthGuard)
export class TumorSyndromesController {
  constructor(private readonly service: TumorSyndromesService) {}

  @Get()
  async findAll(): Promise<TumorSyndromeDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TumorSyndromeDto> {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateTumorSyndromeDto): Promise<TumorSyndromeDto> {
    return this.service.create(dto);
  }
}
