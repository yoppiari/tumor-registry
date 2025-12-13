import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { SsoService } from './sso.service';
import { CreateSsoConfigDto, UpdateSsoConfigDto, SsoLoginDto } from './dto/sso.dto';

@ApiTags('SSO')
@Controller('sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Post('config/:centerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create SSO configuration for a center' })
  async createSsoConfig(
    @Param('centerId') centerId: string,
    @Body() dto: CreateSsoConfigDto,
    @Req() req: any,
  ) {
    return this.ssoService.createSsoConfig(centerId, dto, req.user.userId);
  }

  @Get('config/center/:centerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all SSO configurations for a center' })
  async getSsoConfigs(@Param('centerId') centerId: string) {
    return this.ssoService.getSsoConfigs(centerId);
  }

  @Get('config/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SSO configuration by ID' })
  async getSsoConfig(@Param('id') id: string) {
    return this.ssoService.getSsoConfig(id);
  }

  @Put('config/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update SSO configuration' })
  async updateSsoConfig(
    @Param('id') id: string,
    @Body() dto: UpdateSsoConfigDto,
    @Req() req: any,
  ) {
    return this.ssoService.updateSsoConfig(id, dto, req.user.userId);
  }

  @Delete('config/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete SSO configuration' })
  async deleteSsoConfig(@Param('id') id: string, @Req() req: any) {
    return this.ssoService.deleteSsoConfig(id, req.user.userId);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login via SSO (SAML or OIDC)' })
  async loginViaSso(@Body() dto: SsoLoginDto) {
    return this.ssoService.loginViaSso(dto);
  }

  @Get('test/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test SSO configuration' })
  async testSsoConfig(@Param('id') id: string) {
    return this.ssoService.testSsoConfig(id);
  }

  @Get('login-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get SSO login history for current user' })
  async getSsoLoginHistory(@Req() req: any, @Query('limit') limit?: number) {
    return this.ssoService.getSsoLoginHistory(req.user.userId, limit ? parseInt(limit.toString()) : 20);
  }
}
