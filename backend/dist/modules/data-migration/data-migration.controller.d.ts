import { DataMigrationService } from './data-migration.service';
export declare class DataMigrationController {
    private readonly dataMigrationService;
    constructor(dataMigrationService: DataMigrationService);
    importPatientData(importConfig: {
        format: 'csv' | 'json' | 'excel' | 'xml';
        mapping: {
            [key: string]: string;
        };
        options: {
            skipValidation?: boolean;
            updateExisting?: boolean;
            batchSize?: number;
            generateMRN?: boolean;
        };
    }, file: Express.Multer.File): Promise<any>;
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
    getBackups(): Promise<{
        message: string;
        backups: {
            id: string;
            type: string;
            entities: string[];
            createdAt: string;
            size: number;
            status: string;
            location: string;
            checksum: string;
        }[];
    }>;
    getBackupDetails(backupId: string): Promise<{
        message: string;
        backupId: string;
        details: {
            id: string;
            type: string;
            entities: string[];
            createdAt: string;
            completedAt: string;
            size: number;
            compressed: boolean;
            encrypted: boolean;
            recordCounts: {
                patients: number;
                diagnoses: number;
                treatments: number;
            };
            integrity: {
                checksum: string;
                verified: boolean;
                corruptionCheck: string;
            };
            metadata: {
                version: string;
                createdBy: string;
                environment: string;
            };
        };
    }>;
    getImportHistory(status?: string, entity?: string, dateFrom?: string, dateTo?: string): Promise<{
        message: string;
        filters: {
            status: string;
            entity: string;
            dateFrom: string;
            dateTo: string;
        };
        history: {
            importId: string;
            entity: string;
            format: string;
            status: string;
            totalRecords: number;
            successfulImports: number;
            failedImports: number;
            startTime: string;
            endTime: string;
            createdBy: string;
        }[];
    }>;
    getExportHistory(format?: string, entity?: string, dateFrom?: string, dateTo?: string): Promise<{
        message: string;
        filters: {
            format: string;
            entity: string;
            dateFrom: string;
            dateTo: string;
        };
        history: {
            exportId: string;
            entity: string;
            format: string;
            status: string;
            recordCount: number;
            fileSize: number;
            downloadUrl: string;
            createdAt: string;
            expiresAt: string;
            createdBy: string;
        }[];
    }>;
    downloadExport(exportId: string): Promise<{
        message: string;
        exportId: string;
        downloadUrl: string;
        instructions: string;
    }>;
    getMigrationHistory(): Promise<{
        message: string;
        migrations: {
            migrationId: string;
            sourceSystem: string;
            targetSystem: string;
            entities: string[];
            status: string;
            summary: {
                totalRecords: number;
                successfulMigrations: number;
                failedMigrations: number;
            };
            startTime: string;
            endTime: string;
            duration: number;
        }[];
    }>;
    createImportTemplate(templateData: {
        name: string;
        description: string;
        entityType: string;
        format: 'csv' | 'json' | 'excel' | 'xml';
        fieldMapping: {
            [sourceField: string]: string;
        };
        validationRules: any;
        defaultOptions: any;
    }): Promise<{
        message: string;
        templateId: string;
        templateData: {
            name: string;
            description: string;
            entityType: string;
            format: "csv" | "json" | "excel" | "xml";
            fieldMapping: {
                [sourceField: string]: string;
            };
            validationRules: any;
            defaultOptions: any;
        };
        createdAt: Date;
    }>;
    getImportTemplates(entityType?: string): Promise<{
        message: string;
        filters: {
            entityType: string;
        };
        templates: ({
            templateId: string;
            name: string;
            description: string;
            entityType: string;
            format: string;
            fieldMapping: {
                'Patient Name': string;
                'Date of Birth': string;
                Gender: string;
                Phone: string;
                'Patient MRN'?: undefined;
                'Diagnosis Code'?: undefined;
                'Diagnosis Description'?: undefined;
                'Diagnosis Date'?: undefined;
            };
            validationRules: {
                required: string[];
                formats: {
                    dateOfBirth: string;
                    gender: string;
                };
            };
            defaultOptions: {
                generateMRN: boolean;
                skipValidation: boolean;
            };
        } | {
            templateId: string;
            name: string;
            description: string;
            entityType: string;
            format: string;
            fieldMapping: {
                'Patient MRN': string;
                'Diagnosis Code': string;
                'Diagnosis Description': string;
                'Diagnosis Date': string;
                'Patient Name'?: undefined;
                'Date of Birth'?: undefined;
                Gender?: undefined;
                Phone?: undefined;
            };
            validationRules?: undefined;
            defaultOptions?: undefined;
        })[];
    }>;
    getImportTemplate(templateId: string): Promise<{
        message: string;
        templateId: string;
        template: {
            templateId: string;
            name: string;
            description: string;
            entityType: string;
            format: string;
            fieldMapping: {
                'Patient Name': string;
                'Date of Birth': string;
                Gender: string;
                Phone: string;
            };
            validationRules: {
                required: string[];
                formats: {
                    dateOfBirth: string;
                    gender: string;
                };
            };
            defaultOptions: {
                generateMRN: boolean;
                skipValidation: boolean;
            };
            usageCount: number;
            lastUsed: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    performDataCleansing(cleansingConfig: {
        entityType: string;
        operations: {
            [operation: string]: {
                field?: string;
                rule?: string;
                value?: any;
            };
        };
        filters?: {
            dateFrom?: string;
            dateTo?: string;
            status?: string;
        };
        dryRun?: boolean;
    }): Promise<{
        message: string;
        entityType: string;
        operations: {
            [operation: string]: {
                field?: string;
                rule?: string;
                value?: any;
            };
        };
        results: {
            totalRecords: number;
            recordsModified: number;
            modificationsMade: number;
            errors: number;
        };
        changes: {
            operation: string;
            records: number;
            examples: {
                oldValue: string;
                newValue: string;
            }[];
        }[];
    }>;
    getMigrationStatistics(): Promise<{
        message: string;
        statistics: {
            totalImports: number;
            totalExports: number;
            totalMigrations: number;
            successfulOperations: number;
            failedOperations: number;
            totalRecordsProcessed: number;
            averageProcessingTime: number;
        };
        byType: {
            imports: {
                total: number;
                successful: number;
                failed: number;
            };
            exports: {
                total: number;
                successful: number;
                failed: number;
            };
            migrations: {
                total: number;
                successful: number;
                failed: number;
            };
        };
        byFormat: {
            csv: {
                imports: number;
                exports: number;
            };
            json: {
                imports: number;
                exports: number;
            };
            excel: {
                imports: number;
                exports: number;
            };
            xml: {
                imports: number;
                exports: number;
            };
        };
        recentActivity: {
            type: string;
            entity: string;
            status: string;
            timestamp: string;
            records: number;
        }[];
    }>;
}
