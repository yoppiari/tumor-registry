import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ConflictResolution {
  USE_LOCAL = 'USE_LOCAL',
  USE_REMOTE = 'USE_REMOTE',
  MERGE = 'MERGE',
  MANUAL = 'MANUAL',
}

export class ResolveConflictDto {
  @ApiProperty({ enum: ConflictResolution })
  @IsEnum(ConflictResolution)
  resolution: ConflictResolution;

  @ApiPropertyOptional({ description: 'Merged data (required if resolution is MERGE)', type: Object })
  @IsOptional()
  mergedData?: any;
}
