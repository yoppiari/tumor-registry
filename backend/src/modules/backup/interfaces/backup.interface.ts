export interface BackupJobData {
  name: string;
  backupType: 'FULL' | 'INCREMENTAL' | 'DIFFERENTIAL' | 'TRANSACTION_LOG' | 'SNAPSHOT' | 'CONTINUOUS';
  dataSource: string;
  schedule?: string;
  retentionDays: number;
  compression: boolean;
  encryption: boolean;
  storageLocation: string;
  storagePath?: string;
  isActive: boolean;
  backupOptions?: any;
  verificationMode: 'NONE' | 'CHECKSUM' | 'FULL' | 'SAMPLE' | 'INTEGRITY_CHECK';
  createdBy: string;
  centerId?: string;
}

export interface BackupExecutionData {
  backupJobId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'CORRUPTED' | 'VERIFIED';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  fileSize?: bigint;
  compressedSize?: bigint;
  filesCount?: number;
  filePath?: string;
  checksum?: string;
  verificationPassed?: boolean;
  errorMessage?: string;
  retryCount: number;
  metadata?: any;
}

export interface BackupOptions {
  includeSchemas?: boolean;
  includeData?: boolean;
  includeIndexes?: boolean;
  includeTriggers?: boolean;
  includeStoredProcedures?: boolean;
  includeViews?: boolean;
  includeUsers?: boolean;
  includePermissions?: boolean;
  excludeTables?: string[];
  includeTables?: string[];
  whereConditions?: string[];
  compression?: boolean;
  compressionLevel?: number;
  encryptionKey?: string;
  splitFiles?: boolean;
  maxFileSize?: number;
  parallelThreads?: number;
  customScripts?: string[];
}

export interface StorageConfig {
  type: 'LOCAL' | 'S3' | 'FTP' | 'SFTP' | 'AZURE_BLOB' | 'GOOGLE_CLOUD';
  connectionConfig: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
    bucket?: string;
    region?: string;
    accessKey?: string;
    secretKey?: string;
    container?: string;
    project?: string;
    endpoint?: string;
    path?: string;
  };
  retentionPolicy?: {
    dailyBackups: number;
    weeklyBackups: number;
    monthlyBackups: number;
    yearlyBackups: number;
  };
}

export interface RecoveryOptions {
  restoreToPoint?: Date;
  overwriteExisting?: boolean;
    skipErrors?: boolean;
  verifyIntegrity?: boolean;
  dryRun?: boolean;
  partialRestore?: {
    schemas?: string[];
    tables?: string[];
    excludeTables?: string[];
  };
  targetDatabase?: string;
  customScripts?: string[];
}

export interface RecoveryResult {
  success: boolean;
  restoredFiles: string[];
  restoredRecords: number;
  errors: string[];
  warnings: string[];
  duration: number;
  checksumVerified: boolean;
  metadata?: any;
}

export interface BackupStatistics {
  totalJobs: number;
  activeJobs: number;
  completedBackups: number;
  failedBackups: number;
  totalStorageUsed: bigint;
  averageBackupTime: number;
  successRate: number;
  lastBackupTime?: Date;
  nextScheduledBackup?: Date;
  storageDistribution: Record<string, bigint>;
  typeDistribution: Record<string, number>;
}

export interface BackupHealthStatus {
  overall: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  lastSuccessfulBackup?: Date;
  failedBackupCount: number;
  storageCapacity: {
    used: bigint;
    total: bigint;
    percentage: number;
  };
  upcomingBackups: Array<{
    jobId: string;
    jobName: string;
    scheduledTime: Date;
    estimatedDuration: number;
  }>;
  alerts: Array<{
    type: 'STORAGE_FULL' | 'BACKUP_FAILURE' | 'VERIFICATION_FAILED' | 'RETENTION_POLICY';
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }>;
}

export interface BackupRetentionResult {
  deletedBackups: number;
  freedSpace: bigint;
  errors: string[];
  deletedFiles: string[];
}