import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CentersService } from './centers.service';
import { CreateCenterDto } from './dto/create-center.dto';
import { UpdateCenterDto } from './dto/update-center.dto';
import { CenterResponseDto } from './dto/center-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('centers')
@Controller('centers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Create new center' })
  @ApiResponse({ status: 201, description: 'Center successfully created', type: CenterResponseDto })
  @ApiResponse({ status: 409, description: 'Center code or email already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @Roles('admin', 'national_stakeholder')
  async create(@Body() createCenterDto: CreateCenterDto) {
    return this.centersService.create(createCenterDto);
  }

  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  @ApiOperation({ summary: 'Get all centers with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of centers' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'province', required: false, description: 'Filter by province' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by center type' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('city') city?: string,
    @Query('province') province?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.centersService.findAll(page, limit, city, province, type, isActive);
  }

  @Get('statistics')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get centers statistics' })
  @ApiResponse({ status: 200, description: 'Centers statistics' })
  async getStatistics() {
    return this.centersService.getStatistics();
  }

  @Get('code/:code')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get center by code' })
  @ApiParam({ name: 'code', description: 'Center code' })
  @ApiResponse({ status: 200, description: 'Center found', type: CenterResponseDto })
  @ApiResponse({ status: 404, description: 'Center not found' })
  async findByCode(@Param('code') code: string) {
    return this.centersService.findByCode(code);
  }

  @Get(':id')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  @ApiOperation({ summary: 'Get center by ID' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center found', type: CenterResponseDto })
  @ApiResponse({ status: 404, description: 'Center not found' })
  async findOne(@Param('id') id: string) {
    return this.centersService.findOne(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Update center information' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center successfully updated', type: CenterResponseDto })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @ApiResponse({ status: 409, description: 'Center code or email already exists' })
  @Roles('admin', 'national_stakeholder')
  async update(@Param('id') id: string, @Body() updateCenterDto: UpdateCenterDto) {
    return this.centersService.update(id, updateCenterDto);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Activate a center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center successfully activated', type: CenterResponseDto })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @Roles('admin', 'national_stakeholder')
  async activate(@Param('id') id: string) {
    return this.centersService.activate(id);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Deactivate a center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center successfully deactivated', type: CenterResponseDto })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @Roles('admin', 'national_stakeholder')
  async deactivate(@Param('id') id: string) {
    return this.centersService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Delete a center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 204, description: 'Center successfully deleted' })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete center with active users' })
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.centersService.remove(id);
  }
}