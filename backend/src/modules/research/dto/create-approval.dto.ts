import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApprovalLevel, ApprovalStatus } from '@prisma/client';

export class CreateApprovalDto {
  @ApiProperty({ description: 'Research request ID' })
  @IsString()
  @IsNotEmpty()
  researchRequestId: string;

  @ApiProperty({ enum: ApprovalLevel, description: 'Approval level' })
  @IsEnum(ApprovalLevel)
  level: ApprovalLevel;

  @ApiProperty({ enum: ApprovalStatus, description: 'Approval status' })
  @IsEnum(ApprovalStatus)
  status: ApprovalStatus;

  @ApiPropertyOptional({ description: 'Approval comments' })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiPropertyOptional({ description: 'Approval conditions (JSON format)' })
  @IsString()
  @IsOptional()
  conditions?: string;

  @ApiPropertyOptional({ description: 'Whether this is the final approval' })
  @IsBoolean()
  @IsOptional()
  isFinal?: boolean;

  @ApiPropertyOptional({ description: 'Whether delegation is allowed' })
  @IsBoolean()
  @IsOptional()
  delegationAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Delegated to user ID' })
  @IsString()
  @IsOptional()
  delegatedToId?: string;
}

export class UpdateApprovalDto {
  @ApiPropertyOptional({ enum: ApprovalStatus, description: 'Approval status' })
  @IsEnum(ApprovalStatus)
  @IsOptional()
  status?: ApprovalStatus;

  @ApiPropertyOptional({ description: 'Approval comments' })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiPropertyOptional({ description: 'Approval conditions (JSON format)' })
  @IsString()
  @IsOptional()
  conditions?: string;

  @ApiPropertyOptional({ description: 'Whether this is the final approval' })
  @IsBoolean()
  @IsOptional()
  isFinal?: boolean;

  @ApiPropertyOptional({ description: 'Whether delegation is allowed' })
  @IsBoolean()
  @IsOptional()
  delegationAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Delegated to user ID' })
  @IsString()
  @IsOptional()
  delegatedToId?: string;
}