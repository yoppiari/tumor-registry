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
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  @RequirePermissions('ROLES_READ')
  @ApiQuery({ name: 'includePermissions', required: false, type: Boolean })
  async findAll(@Query('includePermissions') includePermissions?: string) {
    const include = includePermissions === 'true';
    return await this.rolesService.findAll(include);
  }

  @Get('hierarchy')
  @ApiOperation({ summary: 'Get role hierarchy' })
  @ApiResponse({ status: 200, description: 'Role hierarchy retrieved successfully' })
  @RequirePermissions('ROLES_READ')
  async getHierarchy() {
    return await this.rolesService.getRoleHierarchy();
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions grouped by resource' })
  @ApiResponse({ status: 200, description: 'Permissions retrieved successfully' })
  @RequirePermissions('PERMISSIONS_READ')
  async getAllPermissions() {
    return await this.rolesService.getAllPermissions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @RequirePermissions('ROLES_READ')
  @ApiQuery({ name: 'includePermissions', required: false, type: Boolean })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('includePermissions') includePermissions?: string,
  ) {
    const include = includePermissions === 'true';
    return await this.rolesService.findById(id, include);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get role permissions' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role permissions retrieved successfully' })
  @RequirePermissions('ROLES_READ')
  async getRolePermissions(@Param('id', ParseUUIDPipe) id: string) {
    return await this.rolesService.getRolePermissions(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Role already exists' })
  @RequirePermissions('ROLES_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE_ROLE')
  async create(@Body() createRoleDto: {
    name: string;
    code: string;
    description?: string;
    level: number;
    permissionCodes?: string[];
  }) {
    return await this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 403, description: 'Cannot modify system roles' })
  @RequirePermissions('ROLES_UPDATE')
  @AuditLog('UPDATE_ROLE')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: {
      name?: string;
      description?: string;
      level?: number;
      permissionCodes?: string[];
    },
  ) {
    return await this.rolesService.update(id, updateRoleDto);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update role permissions' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role permissions updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @RequirePermissions('ROLES_UPDATE')
  @AuditLog('UPDATE_ROLE_PERMISSIONS')
  async updateRolePermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePermissionsDto: {
      permissionCodes: string[];
    },
  ) {
    await this.rolesService.updateRolePermissions(id, updatePermissionsDto.permissionCodes);
    return { message: 'Role permissions updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 403, description: 'Cannot delete system roles or roles with active users' })
  @RequirePermissions('ROLES_DELETE')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AuditLog('DELETE_ROLE')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.rolesService.delete(id);
  }
}