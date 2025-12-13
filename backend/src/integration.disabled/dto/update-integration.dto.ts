import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SystemConfiguration } from '../interfaces/integration.interface';

export class UpdateExternalSystemDto {
  @ApiPropertyOptional({
    description: 'Name of the external system',
    example: 'Updated Hospital Information System'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Vendor of the external system',
    example: 'Updated Vendor'
  })
  @IsOptional()
  @IsString()
  vendor?: string;

  @ApiPropertyOptional({
    description: 'Version of the external system',
    example: 'v3.0'
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({
    description: 'System status',
    enum: ['active', 'inactive', 'error', 'maintenance'],
    example: 'active'
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'error', 'maintenance'])
  status?: 'active' | 'inactive' | 'error' | 'maintenance';

  @ApiPropertyOptional({
    description: 'System configuration',
    type: 'object',
    example: {
      endpoint: 'https://api.example.com',
      protocol: 'https',
      port: 443,
      authentication: { type: 'bearer', credentials: { token: 'xxx' } },
      timeout: 30,
      retryAttempts: 3,
      retryDelay: 5,
      mapping: [],
      validation: []
    }
  })
  @IsOptional()
  @IsObject()
  configuration?: SystemConfiguration;
}
