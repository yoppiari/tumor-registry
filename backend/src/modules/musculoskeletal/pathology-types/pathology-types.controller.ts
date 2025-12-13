import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PathologyTypesService } from './pathology-types.service';
import {
  PathologyTypeDto,
  CreatePathologyTypeDto,
  UpdatePathologyTypeDto,
} from './dto/pathology-type.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@ApiTags('Pathology Types')
@ApiBearerAuth()
@Controller('pathology-types')
@UseGuards(JwtAuthGuard)
export class PathologyTypesController {
  constructor(private readonly pathologyTypesService: PathologyTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pathology types' })
  @ApiResponse({ status: 200, description: 'Returns all active pathology types', type: [PathologyTypeDto] })
  async findAll(): Promise<PathologyTypeDto[]> {
    return this.pathologyTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pathology type by ID' })
  @ApiResponse({ status: 200, description: 'Returns pathology type', type: PathologyTypeDto })
  @ApiResponse({ status: 404, description: 'Pathology type not found' })
  async findOne(@Param('id') id: string): Promise<PathologyTypeDto> {
    return this.pathologyTypesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get pathology type by code' })
  @ApiResponse({ status: 200, description: 'Returns pathology type', type: PathologyTypeDto })
  @ApiResponse({ status: 404, description: 'Pathology type not found' })
  async findByCode(@Param('code') code: string): Promise<PathologyTypeDto> {
    return this.pathologyTypesService.findByCode(code);
  }

  @Post()
  @ApiOperation({ summary: 'Create new pathology type' })
  @ApiResponse({ status: 201, description: 'Pathology type created', type: PathologyTypeDto })
  async create(@Body() createDto: CreatePathologyTypeDto): Promise<PathologyTypeDto> {
    return this.pathologyTypesService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pathology type' })
  @ApiResponse({ status: 200, description: 'Pathology type updated', type: PathologyTypeDto })
  @ApiResponse({ status: 404, description: 'Pathology type not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePathologyTypeDto,
  ): Promise<PathologyTypeDto> {
    return this.pathologyTypesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete pathology type' })
  @ApiResponse({ status: 200, description: 'Pathology type deleted' })
  @ApiResponse({ status: 404, description: 'Pathology type not found' })
  async remove(@Param('id') id: string): Promise<PathologyTypeDto> {
    return this.pathologyTypesService.remove(id);
  }
}
