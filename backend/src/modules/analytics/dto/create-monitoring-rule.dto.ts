import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMonitoringRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Rule description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Rule conditions' })
  @IsOptional()
  conditions?: any;
}