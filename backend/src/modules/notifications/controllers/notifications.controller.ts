import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { NotificationsService } from '../services/notifications.service';
import {
  SendNotificationDto,
  CreateNotificationPreferenceDto,
  UpdateNotificationPreferenceDto,
} from '../dto/send-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles('SYSTEM_ADMIN', 'CENTER_DIRECTOR')
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  async send(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async getPreferences(@Request() req) {
    return this.notificationsService.getUserPreferences(req.user.id);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Create notification preference' })
  @ApiResponse({ status: 201, description: 'Preference created successfully' })
  async createPreference(@Body() dto: CreateNotificationPreferenceDto, @Request() req) {
    dto.userId = req.user.id;
    return this.notificationsService.createPreference(dto);
  }

  @Put('preferences/:id')
  @ApiOperation({ summary: 'Update notification preference' })
  @ApiResponse({ status: 200, description: 'Preference updated successfully' })
  async updatePreference(@Param('id') id: string, @Body() dto: UpdateNotificationPreferenceDto) {
    return this.notificationsService.updatePreference(id, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get notification history' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getHistory(
    @Request() req,
    @Query('channel') channel?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      channel,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.notificationsService.getNotificationHistory(req.user.id, filters);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Put(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 204, description: 'Notification marked as read' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Get('smart-rules')
  @ApiOperation({ summary: 'Get smart notification rules based on user patterns' })
  @ApiResponse({ status: 200, description: 'Smart rules retrieved successfully' })
  async getSmartRules(@Request() req) {
    return this.notificationsService.getSmartNotificationRules(req.user.id);
  }

  @Post('calendar/sync')
  @ApiOperation({ summary: 'Sync calendar integration' })
  @ApiResponse({ status: 200, description: 'Calendar synced successfully' })
  async syncCalendar(@Request() req) {
    await this.notificationsService.syncCalendar(req.user.id);
    return { message: 'Calendar synced successfully' };
  }
}
