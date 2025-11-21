import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OfflineQueueService } from './offline-queue.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { SyncOfflineDataDto } from './dto/sync-offline-data.dto';
import { ResolveConflictDto } from './dto/resolve-conflict.dto';

@ApiTags('Offline Queue')
@Controller('offline-queue')
@UseGuards(JwtAuthGuard)
export class OfflineQueueController {
  constructor(private readonly offlineQueueService: OfflineQueueService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Queue offline data for synchronization' })
  @ApiResponse({ status: 201, description: 'Data queued and synced successfully' })
  @ApiResponse({ status: 409, description: 'Conflict detected' })
  @HttpCode(HttpStatus.CREATED)
  async syncOfflineData(@Body() syncDto: SyncOfflineDataDto, @Req() req: any) {
    const userId = req.user.userId;
    return await this.offlineQueueService.queueOfflineData(syncDto, userId);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending queue items for current user' })
  @ApiResponse({ status: 200, description: 'Pending queue items retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 100 })
  async getPendingQueue(@Query('limit') limit?: string, @Req() req?: any) {
    const userId = req.user.userId;
    return await this.offlineQueueService.getPendingQueue(userId, limit ? parseInt(limit) : 100);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get queue statistics for current user' })
  @ApiResponse({ status: 200, description: 'Queue statistics retrieved successfully' })
  async getStatistics(@Req() req: any) {
    const userId = req.user.userId;
    return await this.offlineQueueService.getQueueStatistics(userId);
  }

  @Post('sync-all')
  @ApiOperation({ summary: 'Sync all pending items' })
  @ApiResponse({ status: 200, description: 'Bulk sync completed' })
  async syncAll(@Req() req: any) {
    const userId = req.user.userId;
    return await this.offlineQueueService.syncAllPending(userId);
  }

  @Put(':id/retry')
  @ApiOperation({ summary: 'Retry failed queue item' })
  @ApiParam({ name: 'id', description: 'Queue Item ID' })
  @ApiResponse({ status: 200, description: 'Queue item retried successfully' })
  async retry(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.userId;
    return await this.offlineQueueService.processQueueItem(id, userId);
  }

  @Put(':id/resolve-conflict')
  @ApiOperation({ summary: 'Resolve data conflict' })
  @ApiParam({ name: 'id', description: 'Queue Item ID' })
  @ApiResponse({ status: 200, description: 'Conflict resolved successfully' })
  async resolveConflict(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() resolveDto: ResolveConflictDto,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return await this.offlineQueueService.resolveConflict(id, resolveDto, userId);
  }
}
