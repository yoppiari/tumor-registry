import { BackupOptions, BackupExecutionData } from '../interfaces/backup.interface';
export declare class DatabaseBackupStrategy {
    private readonly logger;
    executeBackup(dataSource: string, outputPath: string, options: BackupOptions): Promise<BackupExecutionData>;
    restoreFromBackup(backupFilePath: string, targetDatabase: string, options: any): Promise<any>;
    private buildBackupCommand;
    private buildRestoreCommand;
    private buildPostgresBackupCommand;
    private buildPostgresRestoreCommand;
    private buildMySQLBackupCommand;
    private buildMySQLRestoreCommand;
    private buildMongoDBBackupCommand;
    private buildMongoDBRestoreCommand;
    private detectDatabaseType;
    private detectDatabaseTypeFromPath;
    private calculateChecksum;
}
