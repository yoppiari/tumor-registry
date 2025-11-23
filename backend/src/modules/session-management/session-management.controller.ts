import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SessionManagementService } from './session-management.service';

@ApiTags('Session Management')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionManagementController {
  constructor(private readonly sessionService: SessionManagementService) {}

  @Get('my-sessions')
  @ApiOperation({ summary: 'Get all active sessions for current user' })
  async getMySessions(@Req() req: any) {
    return this.sessionService.getUserSessions(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session details by ID' })
  async getSession(@Param('id') id: string) {
    return this.sessionService.getSessionById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Terminate specific session' })
  async terminateSession(@Param('id') id: string, @Req() req: any) {
    return this.sessionService.terminateSession(id, req.user.userId);
  }

  @Delete('terminate/all')
  @ApiOperation({ summary: 'Terminate all sessions except current' })
  async terminateAllSessions(@Req() req: any) {
    const currentSessionId = req.user.sessionId;
    return this.sessionService.terminateAllSessions(req.user.userId, currentSessionId);
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Cleanup expired sessions (Admin only)' })
  async cleanupExpiredSessions() {
    return this.sessionService.cleanupExpiredSessions();
  }
}
