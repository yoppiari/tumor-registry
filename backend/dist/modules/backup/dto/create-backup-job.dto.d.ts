export declare enum BackupType {
    FULL = "FULL",
    INCREMENTAL = "INCREMENTAL",
    DIFFERENTIAL = "DIFFERENTIAL",
    TRANSACTION_LOG = "TRANSACTION_LOG",
    SNAPSHOT = "SNAPSHOT",
    CONTINUOUS = "CONTINUOUS"
}
export declare enum VerificationMode {
    NONE = "NONE",
    CHECKSUM = "CHECKSUM",
    FULL = "FULL",
    SAMPLE = "SAMPLE",
    INTEGRITY_CHECK = "INTEGRITY_CHECK"
}
export declare class CreateBackupJobDto {
    name: string;
    backupType: BackupType;
    dataSource: string;
    schedule?: string;
    retentionDays?: number;
    compression?: boolean;
    encryption?: boolean;
    storageLocation: string;
    storagePath?: string;
    isActive?: boolean;
    backupOptions?: any;
    verificationMode?: VerificationMode;
    createdBy: string;
    centerId?: string;
}
