import { PrismaService } from '@/database/prisma.service';
export declare class DataMigrationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    importPatientData(fileData: {
        format: 'csv' | 'json' | 'excel' | 'xml';
        data: any[] | Buffer;
        mapping: {
            [key: string]: string;
        };
        options: {
            skipValidation?: boolean;
            updateExisting?: boolean;
            batchSize?: number;
            generateMRN?: boolean;
        };
    }): Promise<any>;
    exportPatientData(exportConfig: {
        format: 'csv' | 'json' | 'excel' | 'fhir' | 'hl7';
        filters?: {
            dateFrom?: string;
            dateTo?: string;
            centerId?: string;
            patientIds?: string[];
            includeDeleted?: boolean;
        };
        fields?: string[];
        options?: {
            anonymize?: boolean;
            includeAuditTrail?: boolean;
            compressOutput?: boolean;
        };
    }): Promise<any>;
    bulkDataMigration(migrationConfig: {
        sourceSystem: {
            type: 'hl7' | 'dicom' | 'fhir' | 'csv' | 'database';
            connectionString: string;
            credentials?: any;
        };
        targetSystem: {
            type: 'postgresql' | 'mysql' | 'mongodb';
            connectionString: string;
        };
        migrationPlan: {
            entities: string[];
            mappingRules: {
                [entity: string]: {
                    [source: string]: string;
                };
            };
            transformationRules?: any;
            validationRules?: any;
        };
        options: {
            dryRun?: boolean;
            batchSize?: number;
            skipErrors?: boolean;
            generateReport?: boolean;
        };
    }): Promise<any>;
    validateDataIntegrity(validationConfig: {
        entities: string[];
        validationRules: {
            [entity: string]: {
                required: string[];
                formats: {
                    [field: string]: string;
                };
                relationships: {
                    [field: string]: string;
                };
                constraints: {
                    [field: string]: any;
                };
            };
        };
        samplingRate?: number;
        includeDeleted?: boolean;
    }): Promise<any>;
    createDataBackup(backupConfig: {
        type: 'full' | 'incremental' | 'differential';
        entities: string[];
        destination: {
            type: 'local' | 's3' | 'azure' | 'gcs';
            path: string;
            credentials?: any;
            compression?: boolean;
            encryption?: boolean;
        };
        options: {
            schedule?: string;
            retentionDays?: number;
            notifyOnCompletion?: boolean;
            dryRun?: boolean;
        };
    }): Promise<any>;
    restoreFromBackup(restoreConfig: {
        backupId: string;
        entities?: string[];
        options: {
            dryRun?: boolean;
            overwriteExisting?: boolean;
            skipValidation?: boolean;
            createBackupBefore?: boolean;
        };
    }): Promise<any>;
    private parseImportData;
    private parseCSVData;
    private parseExcelData;
    private parseXMLData;
    private validatePatientData;
    private mapFields;
    private validatePatientRecord;
    private generateMRN;
    private processBatchedImport;
    private processBatch;
    private processPatientBatch;
    private buildExportQuery;
    private fetchExportData;
    private transformExportData;
    private generateExportFile;
    private migrateEntity;
    private generateMigrationReport;
    private validateEntity;
    private calculateOverallIntegrityScore;
    private identifyCriticalIssues;
    private generateValidationRecommendations;
    private collectBackupData;
    private processBackupData;
    private storeBackup;
    private updateBackupRegistry;
    private sendBackupNotification;
    private getBackupInfo;
    private downloadBackup;
    private extractBackupData;
    private validateRestoreData;
    private processRestore;
}
