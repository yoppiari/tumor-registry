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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CentersService } from './centers.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';

@ApiTags('Centers')
@Controller('centers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CentersController {
  constructor(private readonly centersService: CentersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all centers' })
  @ApiResponse({ status: 200, description: 'Centers retrieved successfully' })
  @RequirePermissions('CENTERS_READ')
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return await this.centersService.findAll(include);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get center statistics' })
  @ApiResponse({ status: 200, description: 'Center statistics retrieved successfully' })
  @RequirePermissions('CENTERS_READ')
  async getStatistics() {
    return await this.centersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get center by ID' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @RequirePermissions('CENTERS_READ')
  @ApiQuery({ name: 'includeUsers', required: false, type: Boolean })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includeUsers') includeUsers?: string,
  ) {
    const include = includeUsers === 'true';
    return await this.centersService.findById(id, include);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get center users' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center users retrieved successfully' })
  @RequirePermissions('USERS_READ')
  async getCenterUsers(@Param('id', ParseUUIDPipe) id: string) {
    return await this.centersService.getCenterUsers(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new center' })
  @ApiResponse({ status: 201, description: 'Center created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Center already exists' })
  @RequirePermissions('CENTERS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'center')
  async create(@Body() createCenterDto: {
    name: string;
    code: string;
    province: string;
    regency?: string;
    address?: string;
  }) {
    return await this.centersService.create(createCenterDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center updated successfully' })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @ApiResponse({ status: 409, description: 'Cannot modify default center' })
  @RequirePermissions('CENTERS_UPDATE')
  @AuditLog('UPDATE', 'center')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCenterDto: {
      name?: string;
      province?: string;
      regency?: string;
      address?: string;
      isActive?: boolean;
    },
  ) {
    return await this.centersService.update(id, updateCenterDto);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center activated successfully' })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @RequirePermissions('CENTERS_UPDATE')
  @AuditLog('ACTIVATE', 'center')
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.centersService.activate(id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 200, description: 'Center deactivated successfully' })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @ApiResponse({ status: 409, description: 'Cannot deactivate default center' })
  @RequirePermissions('CENTERS_UPDATE')
  @AuditLog('DEACTIVATE', 'center')
  async deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return await this.centersService.deactivate(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete center' })
  @ApiParam({ name: 'id', description: 'Center ID' })
  @ApiResponse({ status: 204, description: 'Center deleted successfully' })
  @ApiResponse({ status: 404, description: 'Center not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete default center or centers with active users' })
  @RequirePermissions('CENTERS_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuditLog('DELETE', 'center')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.centersService.delete(id);
  }
}