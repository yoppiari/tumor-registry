import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  Request,
  ParseUUIDPipe,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { AuditLog } from '@/common/decorators/audit-log.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ToggleStatusDto } from './dto/toggle-status.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get all users
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @RequirePermissions('USERS_READ')
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * Get user profile by ID
   */
  @Get('profile/:id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @RequirePermissions('USERS_READ')
  async getProfile(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Remove sensitive information
    const { passwordHash, mfaSecret, ...userProfile } = user as any;
    return userProfile;
  }

  /**
   * Get users by center
   */
  @Get('center/:centerId')
  @ApiOperation({ summary: 'Get all users by center' })
  @ApiParam({ name: 'centerId', description: 'Center ID', type: String })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @RequirePermissions('USERS_READ')
  async getUsersByCenter(@Param('centerId', ParseUUIDPipe) centerId: string) {
    const allUsers = await this.usersService.findAll();

    // Filter users by center
    const centerUsers = allUsers.filter((user: any) =>
      user.center && (user.center.id === centerId || user.center.name === centerId)
    );

    return centerUsers;
  }

  /**
   * Get user statistics
   */
  @Get('statistics')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @RequirePermissions('USERS_READ')
  async getStatistics() {
    const users = await this.usersService.findAll();

    const statistics = {
      total: users.length,
      active: users.filter((u: any) => u.isActive).length,
      inactive: users.filter((u: any) => !u.isActive).length,
      verified: users.filter((u: any) => u.isEmailVerified).length,
      byRole: users.reduce((acc: any, user: any) => {
        const roleName = user.userRoles?.[0]?.role?.name || 'Unknown';
        acc[roleName] = (acc[roleName] || 0) + 1;
        return acc;
      }, {}),
      byCenterCount: users.reduce((acc: any, user: any) => {
        const centerName = user.center?.name || 'Unknown';
        acc[centerName] = (acc[centerName] || 0) + 1;
        return acc;
      }, {}),
    };

    return statistics;
  }

  /**
   * Get single user by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @RequirePermissions('USERS_READ')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Remove sensitive information
    const { passwordHash, mfaSecret, ...safeUser } = user as any;
    return safeUser;
  }

  /**
   * Create a new user
   */
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @RequirePermissions('USERS_CREATE')
  @HttpCode(HttpStatus.CREATED)
  @AuditLog('CREATE', 'user', { includeBody: true })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUserDto,
    @Request() req: any,
  ) {
    const createdById = req.user.id;
    return await this.usersService.createUser(createUserDto, createdById);
  }

  /**
   * Update user
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @RequirePermissions('USERS_UPDATE')
  @AuditLog('UPDATE', 'user', { includeBody: true })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const updatedById = req.user.id;
    return await this.usersService.updateUser(id, updateUserDto, updatedById);
  }

  /**
   * Toggle user active status
   */
  @Patch(':id/status')
  @ApiOperation({ summary: 'Toggle user active status' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Cannot deactivate own account' })
  @RequirePermissions('USERS_UPDATE')
  @AuditLog('UPDATE', 'user_status')
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe()) toggleStatusDto: ToggleStatusDto,
    @Request() req: any,
  ) {
    const updatedById = req.user.id;
    return await this.usersService.toggleUserStatus(
      id,
      toggleStatusDto.isActive,
      updatedById,
    );
  }

  /**
   * Update user role
   */
  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @RequirePermissions('USERS_UPDATE')
  @AuditLog('UPDATE', 'user_role')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { roleCode: string },
    @Request() req: any,
  ) {
    return await this.usersService.updateRole(id, body.roleCode);
  }

  /**
   * Delete user (soft delete)
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (soft delete)' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete own account' })
  @RequirePermissions('USERS_DELETE')
  @AuditLog('DELETE', 'user')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    const deletedById = req.user.id;
    return await this.usersService.deleteUser(id, deletedById);
  }
}
