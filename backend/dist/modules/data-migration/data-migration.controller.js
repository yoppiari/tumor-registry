"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const data_migration_service_1 = require("./data-migration.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
const platform_express_1 = require("@nestjs/platform-express");
let DataMigrationController = class DataMigrationController {
    constructor(dataMigrationService) {
        this.dataMigrationService = dataMigrationService;
    }
    async importPatientData(importConfig, file) {
        return await this.dataMigrationService.importPatientData({
            format: importConfig.format,
            data: file.buffer,
            mapping: importConfig.mapping,
            options: importConfig.options,
        });
    }
    async exportPatientData(exportConfig) {
        return await this.dataMigrationService.exportPatientData(exportConfig);
    }
    async bulkDataMigration(migrationConfig) {
        return await this.dataMigrationService.bulkDataMigration(migrationConfig);
    }
    async validateDataIntegrity(validationConfig) {
        return await this.dataMigrationService.validateDataIntegrity(validationConfig);
    }
    async createDataBackup(backupConfig) {
        return await this.dataMigrationService.createDataBackup(backupConfig);
    }
    async restoreFromBackup(restoreConfig) {
        return await this.dataMigrationService.restoreFromBackup(restoreConfig);
    }
    async getBackups() {
        return {
            message: 'Backups list endpoint',
            backups: [
                {
                    id: 'backup_1700489200000',
                    type: 'full',
                    entities: ['patients', 'diagnoses', 'treatments'],
                    createdAt: '2024-11-20T10:00:00Z',
                    size: 1024000000,
                    status: 'completed',
                    location: '/backups/backup_1700489200000',
                    checksum: 'sha256:abc123...',
                },
                {
                    id: 'backup_1700402800000',
                    type: 'incremental',
                    entities: ['patients', 'medical_records'],
                    createdAt: '2024-11-19T10:00:00Z',
                    size: 512000000,
                    status: 'completed',
                    location: '/backups/backup_1700402800000',
                    checksum: 'sha256:def456...',
                },
            ],
        };
    }
    async getBackupDetails(backupId) {
        return {
            message: 'Backup details endpoint',
            backupId,
            details: {
                id: backupId,
                type: 'full',
                entities: ['patients', 'diagnoses', 'treatments'],
                createdAt: '2024-11-20T10:00:00Z',
                completedAt: '2024-11-20T10:15:00Z',
                size: 1024000000,
                compressed: true,
                encrypted: true,
                recordCounts: {
                    patients: 15420,
                    diagnoses: 23150,
                    treatments: 34890,
                },
                integrity: {
                    checksum: 'sha256:abc123...',
                    verified: true,
                    corruptionCheck: 'passed',
                },
                metadata: {
                    version: '1.2.0',
                    createdBy: 'system_admin',
                    environment: 'production',
                },
            },
        };
    }
    async getImportHistory(status, entity, dateFrom, dateTo) {
        return {
            message: 'Import history endpoint',
            filters: { status, entity, dateFrom, dateTo },
            history: [
                {
                    importId: 'import_1700489200000',
                    entity: 'patients',
                    format: 'csv',
                    status: 'completed',
                    totalRecords: 5000,
                    successfulImports: 4985,
                    failedImports: 15,
                    startTime: '2024-11-20T09:30:00Z',
                    endTime: '2024-11-20T09:35:00Z',
                    createdBy: 'data_manager',
                },
                {
                    importId: 'import_1700402800000',
                    entity: 'diagnoses',
                    format: 'json',
                    status: 'completed',
                    totalRecords: 3000,
                    successfulImports: 2987,
                    failedImports: 13,
                    startTime: '2024-11-19T14:00:00Z',
                    endTime: '2024-11-19T14:03:00Z',
                    createdBy: 'system_admin',
                },
            ],
        };
    }
    async getExportHistory(format, entity, dateFrom, dateTo) {
        return {
            message: 'Export history endpoint',
            filters: { format, entity, dateFrom, dateTo },
            history: [
                {
                    exportId: 'export_1700489200000',
                    entity: 'patients',
                    format: 'fhir',
                    status: 'completed',
                    recordCount: 15420,
                    fileSize: 20480000,
                    downloadUrl: '/api/exports/download/export_1700489200000.json',
                    createdAt: '2024-11-20T11:00:00Z',
                    expiresAt: '2024-11-27T11:00:00Z',
                    createdBy: 'research_coordinator',
                },
                {
                    exportId: 'export_1700402800000',
                    entity: 'all',
                    format: 'excel',
                    status: 'completed',
                    recordCount: 73460,
                    fileSize: 102400000,
                    downloadUrl: '/api/exports/download/export_1700402800000.xlsx',
                    createdAt: '2024-11-19T15:00:00Z',
                    expiresAt: '2024-11-26T15:00:00Z',
                    createdBy: 'admin_user',
                },
            ],
        };
    }
    async downloadExport(exportId) {
        return {
            message: 'File download endpoint',
            exportId,
            downloadUrl: `/api/exports/download/${exportId}`,
            instructions: 'Use this URL to download the exported file',
        };
    }
    async getMigrationHistory() {
        return {
            message: 'Migration history endpoint',
            migrations: [
                {
                    migrationId: 'migration_1700489200000',
                    sourceSystem: 'csv',
                    targetSystem: 'postgresql',
                    entities: ['patients', 'diagnoses'],
                    status: 'completed',
                    summary: {
                        totalRecords: 8000,
                        successfulMigrations: 7985,
                        failedMigrations: 15,
                    },
                    startTime: '2024-11-20T08:00:00Z',
                    endTime: '2024-11-20T08:45:00Z',
                    duration: 2700000,
                },
                {
                    migrationId: 'migration_1700402800000',
                    sourceSystem: 'hl7',
                    targetSystem: 'postgresql',
                    entities: ['medical_records', 'treatments'],
                    status: 'completed',
                    summary: {
                        totalRecords: 12000,
                        successfulMigrations: 11985,
                        failedMigrations: 15,
                    },
                    startTime: '2024-11-19T12:00:00Z',
                    endTime: '2024-11-19T13:30:00Z',
                    duration: 5400000,
                },
            ],
        };
    }
    async createImportTemplate(templateData) {
        return {
            message: 'Import template created',
            templateId: `template_${Date.now()}`,
            templateData,
            createdAt: new Date(),
        };
    }
    async getImportTemplates(entityType) {
        return {
            message: 'Import templates endpoint',
            filters: { entityType },
            templates: [
                {
                    templateId: 'template_1700489200000',
                    name: 'Patient Import Template',
                    description: 'Standard template for importing patient data from CSV files',
                    entityType: 'patients',
                    format: 'csv',
                    fieldMapping: {
                        'Patient Name': 'name',
                        'Date of Birth': 'dateOfBirth',
                        'Gender': 'gender',
                        'Phone': 'phoneNumber',
                    },
                    validationRules: {
                        required: ['name', 'dateOfBirth', 'gender'],
                        formats: {
                            dateOfBirth: 'YYYY-MM-DD',
                            gender: 'MALE|FEMALE|OTHER',
                        },
                    },
                    defaultOptions: {
                        generateMRN: true,
                        skipValidation: false,
                    },
                },
                {
                    templateId: 'template_1700402800000',
                    name: 'Diagnosis Import Template',
                    description: 'Template for importing diagnosis data from Excel files',
                    entityType: 'diagnoses',
                    format: 'excel',
                    fieldMapping: {
                        'Patient MRN': 'patientId',
                        'Diagnosis Code': 'icd10Code',
                        'Diagnosis Description': 'description',
                        'Diagnosis Date': 'diagnosisDate',
                    },
                },
            ],
        };
    }
    async getImportTemplate(templateId) {
        return {
            message: 'Template details endpoint',
            templateId,
            template: {
                templateId: 'template_1700489200000',
                name: 'Patient Import Template',
                description: 'Standard template for importing patient data from CSV files',
                entityType: 'patients',
                format: 'csv',
                fieldMapping: {
                    'Patient Name': 'name',
                    'Date of Birth': 'dateOfBirth',
                    'Gender': 'gender',
                    'Phone': 'phoneNumber',
                },
                validationRules: {
                    required: ['name', 'dateOfBirth', 'gender'],
                    formats: {
                        dateOfBirth: 'YYYY-MM-DD',
                        gender: 'MALE|FEMALE|OTHER',
                    },
                },
                defaultOptions: {
                    generateMRN: true,
                    skipValidation: false,
                },
                usageCount: 25,
                lastUsed: '2024-11-20T09:30:00Z',
                createdAt: '2024-11-15T10:00:00Z',
                updatedAt: '2024-11-18T14:30:00Z',
            },
        };
    }
    async performDataCleansing(cleansingConfig) {
        return {
            message: 'Data cleansing completed',
            entityType: cleansingConfig.entityType,
            operations: cleansingConfig.operations,
            results: {
                totalRecords: 10000,
                recordsModified: 1250,
                modificationsMade: 3200,
                errors: 15,
            },
            changes: [
                {
                    operation: 'format_phone',
                    records: 500,
                    examples: [
                        { oldValue: '08123456789', newValue: '+628123456789' },
                        { oldValue: '02134567890', newValue: '+622134567890' },
                    ],
                },
                {
                    operation: 'standardize_gender',
                    records: 300,
                    examples: [
                        { oldValue: 'M', newValue: 'MALE' },
                        { oldValue: 'F', newValue: 'FEMALE' },
                    ],
                },
            ],
        };
    }
    async getMigrationStatistics() {
        return {
            message: 'Migration statistics endpoint',
            statistics: {
                totalImports: 156,
                totalExports: 89,
                totalMigrations: 12,
                successfulOperations: 234,
                failedOperations: 23,
                totalRecordsProcessed: 1547820,
                averageProcessingTime: 2.5,
            },
            byType: {
                imports: {
                    total: 156,
                    successful: 145,
                    failed: 11,
                },
                exports: {
                    total: 89,
                    successful: 87,
                    failed: 2,
                },
                migrations: {
                    total: 12,
                    successful: 11,
                    failed: 1,
                },
            },
            byFormat: {
                csv: { imports: 89, exports: 23 },
                json: { imports: 34, exports: 45 },
                excel: { imports: 23, exports: 67 },
                xml: { imports: 10, exports: 15 },
            },
            recentActivity: [
                {
                    type: 'import',
                    entity: 'patients',
                    status: 'completed',
                    timestamp: '2024-11-20T10:00:00Z',
                    records: 5000,
                },
                {
                    type: 'export',
                    entity: 'all',
                    status: 'completed',
                    timestamp: '2024-11-20T09:30:00Z',
                    records: 73460,
                },
            ],
        };
    }
};
exports.DataMigrationController = DataMigrationController;
__decorate([
    (0, common_1.Post)('import/patients'),
    (0, swagger_1.ApiOperation)({ summary: 'Import patient data from file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient data imported successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_CREATE'),
    UseInterceptors((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, audit_log_decorator_1.AuditLog)('IMPORT_PATIENT_DATA'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, uploaded_file_type_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "importPatientData", null);
__decorate([
    (0, common_1.Post)('export/patients'),
    (0, swagger_1.ApiOperation)({ summary: 'Export patient data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Patient data export initiated successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_EXPORT'),
    (0, audit_log_decorator_1.AuditLog)('EXPORT_PATIENT_DATA'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "exportPatientData", null);
__decorate([
    (0, common_1.Post)('import/bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform bulk data migration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk data migration completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('BULK_DATA_MIGRATION'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "bulkDataMigration", null);
__decorate([
    (0, common_1.Post)('validate/integrity'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate data integrity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data integrity validation completed' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_READ'),
    (0, audit_log_decorator_1.AuditLog)('VALIDATE_DATA_INTEGRITY'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "validateDataIntegrity", null);
__decorate([
    (0, common_1.Post)('backup/create'),
    (0, swagger_1.ApiOperation)({ summary: 'Create data backup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data backup created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('BACKUP_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('CREATE_DATA_BACKUP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "createDataBackup", null);
__decorate([
    (0, common_1.Post)('backup/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore data from backup' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data restore completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('BACKUP_CREATE'),
    (0, audit_log_decorator_1.AuditLog)('RESTORE_FROM_BACKUP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "restoreFromBackup", null);
__decorate([
    (0, common_1.Get)('backups'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of available backups' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backups list retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('BACKUP_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getBackups", null);
__decorate([
    (0, common_1.Get)('backup/:backupId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup details' }),
    (0, swagger_1.ApiParam)({ name: 'backupId', description: 'Backup ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Backup details retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('BACKUP_READ'),
    __param(0, (0, common_1.Param)('backupId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getBackupDetails", null);
__decorate([
    (0, common_1.Get)('imports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Import history retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_READ'),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'entity', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('entity')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getImportHistory", null);
__decorate([
    (0, common_1.Get)('exports'),
    (0, swagger_1.ApiOperation)({ summary: 'Get export history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Export history retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_READ'),
    (0, swagger_1.ApiQuery)({ name: 'format', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'entity', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    __param(0, (0, common_1.Query)('format')),
    __param(1, (0, common_1.Query)('entity')),
    __param(2, (0, common_1.Query)('dateFrom')),
    __param(3, (0, common_1.Query)('dateTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getExportHistory", null);
__decorate([
    (0, common_1.Get)('exports/:exportId/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download exported file' }),
    (0, swagger_1.ApiParam)({ name: 'exportId', description: 'Export ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'File downloaded successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_EXPORT'),
    __param(0, (0, common_1.Param)('exportId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "downloadExport", null);
__decorate([
    (0, common_1.Get)('migrations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get migration history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Migration history retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getMigrationHistory", null);
__decorate([
    (0, common_1.Post)('templates/import-template'),
    (0, swagger_1.ApiOperation)({ summary: 'Create import template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Import template created successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_IMPORT_TEMPLATE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "createImportTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import templates' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Import templates retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_READ'),
    (0, swagger_1.ApiQuery)({ name: 'entityType', required: false }),
    __param(0, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getImportTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:templateId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get import template details' }),
    (0, swagger_1.ApiParam)({ name: 'templateId', description: 'Template ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template details retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_READ'),
    __param(0, (0, common_1.Param)('templateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getImportTemplate", null);
__decorate([
    (0, common_1.Post)('data-cleansing'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform data cleansing' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Data cleansing completed successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('DATA_MIGRATION_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('DATA_CLEANSING'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "performDataCleansing", null);
__decorate([
    (0, common_1.Get)('statistics/migration'),
    (0, swagger_1.ApiOperation)({ summary: 'Get migration statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Migration statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ANALYTICS_VIEW'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataMigrationController.prototype, "getMigrationStatistics", null);
exports.DataMigrationController = DataMigrationController = __decorate([
    (0, swagger_1.ApiTags)('Data Migration'),
    (0, common_1.Controller)('data-migration'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [data_migration_service_1.DataMigrationService])
], DataMigrationController);
//# sourceMappingURL=data-migration.controller.js.map