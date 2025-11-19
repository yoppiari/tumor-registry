"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseBackupStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseBackupStrategy = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let DatabaseBackupStrategy = DatabaseBackupStrategy_1 = class DatabaseBackupStrategy {
    constructor() {
        this.logger = new common_1.Logger(DatabaseBackupStrategy_1.name);
    }
    async executeBackup(dataSource, outputPath, options) {
        const startTime = new Date();
        const execution = {
            backupJobId: '',
            status: 'RUNNING',
            startTime,
            retryCount: 0,
        };
        try {
            this.logger.log(`Starting database backup for: ${dataSource}`);
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            const backupCommand = await this.buildBackupCommand(dataSource, outputPath, options);
            this.logger.log(`Executing backup command: ${backupCommand}`);
            const { stdout, stderr } = await execAsync(backupCommand);
            const endTime = new Date();
            const fileStats = fs.statSync(outputPath);
            const fileSize = BigInt(fileStats.size);
            let checksum;
            if (options.includeData !== false) {
                checksum = await this.calculateChecksum(outputPath);
            }
            execution.endTime = endTime;
            execution.duration = endTime.getTime() - startTime.getTime();
            execution.status = 'COMPLETED';
            execution.filePath = outputPath;
            execution.fileSize = fileSize;
            execution.checksum = checksum;
            execution.filesCount = 1;
            execution.verificationPassed = true;
            this.logger.log(`Database backup completed successfully: ${outputPath} (${fileSize} bytes)`);
            return execution;
        }
        catch (error) {
            const endTime = new Date();
            execution.endTime = endTime;
            execution.duration = endTime.getTime() - startTime.getTime();
            execution.status = 'FAILED';
            execution.errorMessage = error.message;
            this.logger.error(`Database backup failed: ${error.message}`, error);
            if (fs.existsSync(outputPath)) {
                try {
                    fs.unlinkSync(outputPath);
                }
                catch (cleanupError) {
                    this.logger.warn(`Failed to cleanup partial backup file: ${cleanupError.message}`);
                }
            }
            return execution;
        }
    }
    async restoreFromBackup(backupFilePath, targetDatabase, options) {
        try {
            this.logger.log(`Starting database restore from: ${backupFilePath}`);
            if (!fs.existsSync(backupFilePath)) {
                throw new Error('Backup file does not exist');
            }
            const restoreCommand = await this.buildRestoreCommand(backupFilePath, targetDatabase, options);
            this.logger.log(`Executing restore command: ${restoreCommand}`);
            const { stdout, stderr } = await execAsync(restoreCommand);
            this.logger.log(`Database restore completed successfully: ${targetDatabase}`);
            return {
                success: true,
                restoredFiles: [backupFilePath],
                restoredRecords: 0,
                errors: [],
                warnings: stderr ? [stderr] : [],
                duration: 0,
                checksumVerified: true,
            };
        }
        catch (error) {
            this.logger.error(`Database restore failed: ${error.message}`, error);
            return {
                success: false,
                restoredFiles: [],
                restoredRecords: 0,
                errors: [error.message],
                warnings: [],
                duration: 0,
                checksumVerified: false,
            };
        }
    }
    async buildBackupCommand(dataSource, outputPath, options) {
        const dbType = this.detectDatabaseType(dataSource);
        switch (dbType) {
            case 'postgresql':
                return this.buildPostgresBackupCommand(dataSource, outputPath, options);
            case 'mysql':
                return this.buildMySQLBackupCommand(dataSource, outputPath, options);
            case 'mongodb':
                return this.buildMongoDBBackupCommand(dataSource, outputPath, options);
            default:
                throw new Error(`Unsupported database type: ${dbType}`);
        }
    }
    async buildRestoreCommand(backupFilePath, targetDatabase, options) {
        const dbType = this.detectDatabaseTypeFromPath(backupFilePath);
        switch (dbType) {
            case 'postgresql':
                return this.buildPostgresRestoreCommand(backupFilePath, targetDatabase, options);
            case 'mysql':
                return this.buildMySQLRestoreCommand(backupFilePath, targetDatabase, options);
            case 'mongodb':
                return this.buildMongoDBRestoreCommand(backupFilePath, targetDatabase, options);
            default:
                throw new Error(`Unsupported backup format for database type: ${dbType}`);
        }
    }
    buildPostgresBackupCommand(dataSource, outputPath, options) {
        const pgDumpOptions = [];
        if (options.includeSchemas !== false) {
            pgDumpOptions.push('--schema-only');
        }
        if (options.includeData !== false) {
            pgDumpOptions.push('--data-only');
        }
        if (options.compression) {
            pgDumpOptions.push('--compress=9');
        }
        if (options.excludeTables?.length) {
            options.excludeTables.forEach(table => {
                pgDumpOptions.push(`--exclude-table=${table}`);
            });
        }
        if (options.includeTables?.length) {
            options.includeTables.forEach(table => {
                pgDumpOptions.push(`--table=${table}`);
            });
        }
        if (options.customScripts?.length) {
            pgDumpOptions.push(...options.customScripts);
        }
        const optionsStr = pgDumpOptions.length > 0 ? pgDumpOptions.join(' ') + ' ' : '';
        const command = `pg_dump ${optionsStr}"${dataSource}" > "${outputPath}"`;
        return command;
    }
    buildPostgresRestoreCommand(backupFilePath, targetDatabase, options) {
        const psqlOptions = [];
        if (options.verbose) {
            psqlOptions.push('--verbose');
        }
        if (options.singleTransaction) {
            psqlOptions.push('--single-transaction');
        }
        const optionsStr = psqlOptions.length > 0 ? psqlOptions.join(' ') + ' ' : '';
        const command = `psql ${optionsStr}"${targetDatabase}" < "${backupFilePath}"`;
        return command;
    }
    buildMySQLBackupCommand(dataSource, outputPath, options) {
        const mysqldumpOptions = [];
        if (options.includeSchemas !== false) {
            mysqldumpOptions.push('--routines');
            mysqldumpOptions.push('--triggers');
        }
        if (options.compression) {
            outputPath += '.gz';
            mysqldumpOptions.push('--compress');
        }
        if (options.excludeTables?.length) {
            mysqldumpOptions.push(`--ignore-table=${dataSource}.${options.excludeTables.join(',')}`);
        }
        mysqldumpOptions.push('--single-transaction');
        mysqldumpOptions.push('--quick');
        mysqldumpOptions.push('--lock-tables=false');
        const optionsStr = mysqldumpOptions.length > 0 ? mysqldumpOptions.join(' ') + ' ' : '';
        let command = `mysqldump ${optionsStr}"${dataSource}" > "${outputPath}"`;
        if (options.compression && !outputPath.endsWith('.gz')) {
            command += ` && gzip "${outputPath}"`;
            outputPath += '.gz';
        }
        return command;
    }
    buildMySQLRestoreCommand(backupFilePath, targetDatabase, options) {
        let command = `mysql "${targetDatabase}"`;
        if (backupFilePath.endsWith('.gz')) {
            command = `gunzip -c "${backupFilePath}" | ${command}`;
        }
        else {
            command = `${command} < "${backupFilePath}"`;
        }
        if (options.force) {
            command = `echo "DROP DATABASE IF EXISTS \`${targetDatabase}\`; CREATE DATABASE \`${targetDatabase}\`;" | mysql && ${command}`;
        }
        return command;
    }
    buildMongoDBBackupCommand(dataSource, outputPath, options) {
        const mongodumpOptions = [];
        if (options.includeSchemas !== false) {
            mongodumpOptions.push('--forceTableScan');
        }
        if (options.excludeTables?.length) {
            mongodumpOptions.push(`--excludeCollection=${options.excludeTables.join(',')}`);
        }
        if (options.includeTables?.length) {
            mongodumpOptions.push(`--collection=${options.includeTables.join(',')}`);
        }
        if (options.compression) {
            mongodumpOptions.push('--gzip');
        }
        const optionsStr = mongodumpOptions.length > 0 ? mongodumpOptions.join(' ') + ' ' : '';
        const command = `mongodump ${optionsStr}--db="${dataSource}" --out="${outputPath}"`;
        return command;
    }
    buildMongoDBRestoreCommand(backupFilePath, targetDatabase, options) {
        const mongorestoreOptions = [];
        if (options.drop) {
            mongorestoreOptions.push('--drop');
        }
        if (options.verbose) {
            mongorestoreOptions.push('--verbose');
        }
        const optionsStr = mongorestoreOptions.length > 0 ? mongorestoreOptions.join(' ') + ' ' : '';
        const command = `mongorestore ${optionsStr}--db="${targetDatabase}" "${backupFilePath}"`;
        return command;
    }
    detectDatabaseType(dataSource) {
        if (dataSource.includes('postgresql') || dataSource.includes('postgres')) {
            return 'postgresql';
        }
        if (dataSource.includes('mysql') || dataSource.includes('mariadb')) {
            return 'mysql';
        }
        if (dataSource.includes('mongodb') || dataSource.includes('mongo')) {
            return 'mongodb';
        }
        return 'postgresql';
    }
    detectDatabaseTypeFromPath(filePath) {
        if (filePath.endsWith('.sql') || filePath.endsWith('.dump')) {
            return 'postgresql';
        }
        if (filePath.endsWith('.sql.gz')) {
            return 'mysql';
        }
        if (filePath.includes('bson') || filePath.includes('mongo')) {
            return 'mongodb';
        }
        return 'postgresql';
    }
    async calculateChecksum(filePath) {
        const crypto = require('crypto');
        const hash = crypto.createHash('sha256');
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filePath);
            stream.on('data', (data) => hash.update(data));
            stream.on('end', () => resolve(hash.digest('hex')));
            stream.on('error', reject);
        });
    }
};
exports.DatabaseBackupStrategy = DatabaseBackupStrategy;
exports.DatabaseBackupStrategy = DatabaseBackupStrategy = DatabaseBackupStrategy_1 = __decorate([
    (0, common_1.Injectable)()
], DatabaseBackupStrategy);
//# sourceMappingURL=database-backup.strategy.js.map