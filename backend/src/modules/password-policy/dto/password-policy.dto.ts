import { IsString, IsBoolean, IsNumber, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePasswordPolicyDto {
  @ApiProperty()
  @IsNumber()
  @Min(6)
  @Max(128)
  minLength: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(8)
  @Max(256)
  maxLength?: number;

  @ApiProperty()
  @IsBoolean()
  requireUppercase: boolean;

  @ApiProperty()
  @IsBoolean()
  requireLowercase: boolean;

  @ApiProperty()
  @IsBoolean()
  requireNumbers: boolean;

  @ApiProperty()
  @IsBoolean()
  requireSpecialChars: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(24)
  passwordHistory?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(1)
  expiryDays?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(3)
  @Max(10)
  lockoutAttempts?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(5)
  lockoutDuration?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  preventCommonPasswords?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  preventSequential?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  preventRepeating?: boolean;

  @ApiPropertyOptional({ description: 'Minimum password strength score (0-4)', minimum: 0, maximum: 4 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(4)
  minStrengthScore?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePasswordPolicyDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Min(6)
  @Max(128)
  minLength?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxLength?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requireUppercase?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requireLowercase?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requireNumbers?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requireSpecialChars?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  passwordHistory?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  expiryDays?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  lockoutAttempts?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  lockoutDuration?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  preventCommonPasswords?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  preventSequential?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  preventRepeating?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  minStrengthScore?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ValidatePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  centerId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
}
