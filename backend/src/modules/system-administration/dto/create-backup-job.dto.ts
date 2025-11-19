import { IsString, IsOptional, IsBoolean, IsJSON, IsEnum, IsInt } from 'class-validator';

export enum BackupType {
  FULL = 'FULL',
  INCREMENTAL = 'INCREMENTAL',
  DIFFERENTIAL = 'DIFFERENTIAL',
  TRANSACTION_LOG = 'TRANSACTION_LOG',
  SNAPSHOT = 'SNAPSHOT',
  CONTINUOUS = 'CONTINUOUS',
}

export enum VerificationMode {
  NONE = 'NONE',
  CHECKSUM = 'CHECKSUM',
  FULL = 'FULL',
  SAMPLE = 'SAMPLE',
  INTEGRITY_CHECK = 'INTEGRITY_CHECK',
}

export class CreateBackupJobDto {
  @IsString()
  name: string;

  @IsEnum(BackupType)
  backupType: BackupType;

  @IsString()
  dataSource: string;

  @IsOptional()
  @IsString()
  schedule?: string;

  @IsOptional()
  @IsInt()
  retentionDays?: number;

  @IsOptional()
  @IsBoolean()
  compression?: boolean;

  @IsOptional()
  @IsBoolean()
  encryption?: boolean;

  @IsString()
  storageLocation: string;

  @IsOptional()
  @IsString()
  storagePath?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsJSON()
  backupOptions?: any;

  @IsOptional()
  @IsEnum(VerificationMode)
  verificationMode?: VerificationMode;

  @IsString()
  createdBy: string;
}