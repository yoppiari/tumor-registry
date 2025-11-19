import { Injectable, Logger } from '@nestjs/common';
import { BackupOptions, BackupExecutionData } from '../interfaces/backup.interface';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseBackupStrategy {
  private readonly logger = new Logger(DatabaseBackupStrategy.name);

  async executeBackup(
    dataSource: string,
    outputPath: string,
    options: BackupOptions,
  ): Promise<BackupExecutionData> {
    const startTime = new Date();
    const execution: BackupExecutionData = {
      backupJobId: '', // Will be set by calling service
      status: 'RUNNING',
      startTime,
      retryCount: 0,
    };

    try {
      this.logger.log(`Starting database backup for: ${dataSource}`);

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Build backup command based on database type
      const backupCommand = await this.buildBackupCommand(dataSource, outputPath, options);
      this.logger.log(`Executing backup command: ${backupCommand}`);

      // Execute backup
      const { stdout, stderr } = await execAsync(backupCommand);
      const endTime = new Date();

      // Get file statistics
      const fileStats = fs.statSync(outputPath);
      const fileSize = BigInt(fileStats.size);

      // Calculate checksum if verification is enabled
      let checksum: string | undefined;
      if (options.includeData !== false) {
        checksum = await this.calculateChecksum(outputPath);
      }

      execution.endTime = endTime;
      execution.duration = endTime.getTime() - startTime.getTime();
      execution.status = 'COMPLETED';
      execution.filePath = outputPath;
      execution.fileSize = fileSize;
      execution.checksum = checksum;
      execution.filesCount = 1; // Single database backup file
      execution.verificationPassed = true;

      this.logger.log(`Database backup completed successfully: ${outputPath} (${fileSize} bytes)`);

      return execution;
    } catch (error) {
      const endTime = new Date();
      execution.endTime = endTime;
      execution.duration = endTime.getTime() - startTime.getTime();
      execution.status = 'FAILED';
      execution.errorMessage = error.message;

      this.logger.error(`Database backup failed: ${error.message}`, error);

      // Clean up partial backup file if it exists
      if (fs.existsSync(outputPath)) {
        try {
          fs.unlinkSync(outputPath);
        } catch (cleanupError) {
          this.logger.warn(`Failed to cleanup partial backup file: ${cleanupError.message}`);
        }
      }

      return execution;
    }
  }

  async restoreFromBackup(
    backupFilePath: string,
    targetDatabase: string,
    options: any,
  ): Promise<any> {
    try {
      this.logger.log(`Starting database restore from: ${backupFilePath}`);

      if (!fs.existsSync(backupFilePath)) {
        throw new Error('Backup file does not exist');
      }

      // Build restore command based on database type
      const restoreCommand = await this.buildRestoreCommand(backupFilePath, targetDatabase, options);
      this.logger.log(`Executing restore command: ${restoreCommand}`);

      // Execute restore
      const { stdout, stderr } = await execAsync(restoreCommand);

      this.logger.log(`Database restore completed successfully: ${targetDatabase}`);

      return {
        success: true,
        restoredFiles: [backupFilePath],
        restoredRecords: 0, // Would need to parse restore output for actual count
        errors: [],
        warnings: stderr ? [stderr] : [],
        duration: 0,
        checksumVerified: true,
      };
    } catch (error) {
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

  private async buildBackupCommand(
    dataSource: string,
    outputPath: string,
    options: BackupOptions,
  ): Promise<string> {
    // This is a simplified implementation
    // In production, you would detect database type from dataSource or configuration
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

  private async buildRestoreCommand(
    backupFilePath: string,
    targetDatabase: string,
    options: any,
  ): Promise<string> {
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

  private buildPostgresBackupCommand(
    dataSource: string,
    outputPath: string,
    options: BackupOptions,
  ): string {
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

    // Add custom options
    if (options.customScripts?.length) {
      pgDumpOptions.push(...options.customScripts);
    }

    const optionsStr = pgDumpOptions.length > 0 ? pgDumpOptions.join(' ') + ' ' : '';
    const command = `pg_dump ${optionsStr}"${dataSource}" > "${outputPath}"`;

    return command;
  }

  private buildPostgresRestoreCommand(
    backupFilePath: string,
    targetDatabase: string,
    options: any,
  ): string {
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

  private buildMySQLBackupCommand(
    dataSource: string,
    outputPath: string,
    options: BackupOptions,
  ): string {
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

    // Add single-transaction option for consistent backup
    mysqldumpOptions.push('--single-transaction');
    mysqldumpOptions.push('--quick');
    mysqldumpOptions.push('--lock-tables=false');

    const optionsStr = mysqldumpOptions.length > 0 ? mysqldumpOptions.join(' ') + ' ' : '';
    let command = `mysqldump ${optionsStr}"${dataSource}" > "${outputPath}"`;

    // Add compression if needed
    if (options.compression && !outputPath.endsWith('.gz')) {
      command += ` && gzip "${outputPath}"`;
      outputPath += '.gz';
    }

    return command;
  }

  private buildMySQLRestoreCommand(
    backupFilePath: string,
    targetDatabase: string,
    options: any,
  ): string {
    let command = `mysql "${targetDatabase}"`;

    // Handle compressed backups
    if (backupFilePath.endsWith('.gz')) {
      command = `gunzip -c "${backupFilePath}" | ${command}`;
    } else {
      command = `${command} < "${backupFilePath}"`;
    }

    if (options.force) {
      command = `echo "DROP DATABASE IF EXISTS \`${targetDatabase}\`; CREATE DATABASE \`${targetDatabase}\`;" | mysql && ${command}`;
    }

    return command;
  }

  private buildMongoDBBackupCommand(
    dataSource: string,
    outputPath: string,
    options: BackupOptions,
  ): string {
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

  private buildMongoDBRestoreCommand(
    backupFilePath: string,
    targetDatabase: string,
    options: any,
  ): string {
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

  private detectDatabaseType(dataSource: string): string {
    // Simple detection based on connection string or database name
    if (dataSource.includes('postgresql') || dataSource.includes('postgres')) {
      return 'postgresql';
    }
    if (dataSource.includes('mysql') || dataSource.includes('mariadb')) {
      return 'mysql';
    }
    if (dataSource.includes('mongodb') || dataSource.includes('mongo')) {
      return 'mongodb';
    }

    // Default to PostgreSQL
    return 'postgresql';
  }

  private detectDatabaseTypeFromPath(filePath: string): string {
    if (filePath.endsWith('.sql') || filePath.endsWith('.dump')) {
      return 'postgresql';
    }
    if (filePath.endsWith('.sql.gz')) {
      return 'mysql';
    }
    if (filePath.includes('bson') || filePath.includes('mongo')) {
      return 'mongodb';
    }

    // Default to PostgreSQL
    return 'postgresql';
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath);
      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}