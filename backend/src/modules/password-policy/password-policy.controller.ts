import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { PasswordPolicyService } from './password-policy.service';
import { CreatePasswordPolicyDto, UpdatePasswordPolicyDto, ValidatePasswordDto } from './dto/password-policy.dto';

@ApiTags('Password Policy')
@Controller('password-policy')
export class PasswordPolicyController {
  constructor(private readonly passwordPolicyService: PasswordPolicyService) {}

  @Post(':centerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create password policy for a center' })
  async createPolicy(
    @Param('centerId') centerId: string,
    @Body() dto: CreatePasswordPolicyDto,
    @Req() req: any,
  ) {
    return this.passwordPolicyService.createPolicy(centerId, dto, req.user.userId);
  }

  @Get('center/:centerId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get password policy for a center' })
  async getPolicy(@Param('centerId') centerId: string) {
    return this.passwordPolicyService.getPolicy(centerId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password policy' })
  async updatePolicy(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordPolicyDto,
    @Req() req: any,
  ) {
    return this.passwordPolicyService.updatePolicy(id, dto, req.user.userId);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate password against policy' })
  async validatePassword(@Body() dto: ValidatePasswordDto) {
    return this.passwordPolicyService.validatePassword(dto);
  }

  @Get('user/policy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get password policy for current user' })
  async getUserPolicy(@Req() req: any) {
    return this.passwordPolicyService.getPasswordPolicyForUser(req.user.userId);
  }

  @Get('user/expiry')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check password expiry for current user' })
  async checkPasswordExpiry(@Req() req: any) {
    return this.passwordPolicyService.checkPasswordExpiry(req.user.userId);
  }
}
