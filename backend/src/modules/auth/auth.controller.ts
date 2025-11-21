import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import type { FastifyRequest } from 'fastify';
import { MfaService } from './mfa.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('verify-mfa')
  @HttpCode(HttpStatus.OK)
  async verifyMFA(
    @Body('tempToken') tempToken: string,
    @Body('mfaCode') mfaCode: string,
  ) {
    return this.authService.verifyMFA(tempToken, mfaCode);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: FastifyRequest) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: FastifyRequest) {
    // In a real implementation, you would invalidate the token here
    return { message: 'Logged out successfully' };
  }

  // MFA Management Endpoints
  @Post('mfa/setup')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate MFA secret and QR code' })
  @ApiResponse({ status: 200, description: 'MFA secret generated successfully' })
  async setupMfa(@Req() req: FastifyRequest) {
    const user = req.user as any;
    return await this.mfaService.generateSecret(user.id);
  }

  @Post('mfa/enable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Enable MFA with verification code' })
  @ApiResponse({ status: 200, description: 'MFA enabled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async enableMfa(
    @Req() req: FastifyRequest,
    @Body('secret') secret: string,
    @Body('token') token: string,
  ) {
    const user = req.user as any;
    return await this.mfaService.enableMfa(user.id, secret, token);
  }

  @Post('mfa/disable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable MFA' })
  @ApiResponse({ status: 200, description: 'MFA disabled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code or password' })
  async disableMfa(
    @Req() req: FastifyRequest,
    @Body('password') password: string,
    @Body('token') token?: string,
  ) {
    const user = req.user as any;
    await this.mfaService.disableMfa(user.id, password, token);
    return { message: 'MFA disabled successfully' };
  }

  @Post('mfa/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify MFA token' })
  @ApiResponse({ status: 200, description: 'MFA token verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid MFA token' })
  async verifyMfaToken(
    @Req() req: FastifyRequest,
    @Body('token') token: string,
  ) {
    const user = req.user as any;
    const isValid = await this.mfaService.verifyToken(user.id, token);
    return { valid: isValid };
  }

  @Post('mfa/backup-codes/regenerate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate backup codes' })
  @ApiResponse({ status: 200, description: 'Backup codes regenerated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async regenerateBackupCodes(
    @Req() req: FastifyRequest,
    @Body('token') token: string,
  ) {
    const user = req.user as any;
    const backupCodes = await this.mfaService.regenerateBackupCodes(user.id, token);
    return { backupCodes };
  }

  @Post('mfa/backup-codes/verify')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify backup code' })
  @ApiResponse({ status: 200, description: 'Backup code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid backup code' })
  async verifyBackupCode(
    @Req() req: FastifyRequest,
    @Body('backupCode') backupCode: string,
  ) {
    const user = req.user as any;
    const isValid = await this.mfaService.verifyBackupCode(user.id, backupCode);
    return { valid: isValid };
  }

  @Get('mfa/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get MFA status' })
  @ApiResponse({ status: 200, description: 'MFA status retrieved successfully' })
  async getMfaStatus(@Req() req: FastifyRequest) {
    const user = req.user as any;
    const isRequired = await this.mfaService.isMfaRequired(user.id);
    return {
      mfaEnabled: user.mfaEnabled,
      mfaRequired: isRequired,
    };
  }
}