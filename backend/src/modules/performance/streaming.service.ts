import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { PerformanceMonitorService } from './performance-monitor.service';
import { Readable, Transform } from 'stream';

export interface StreamOptions {
  batchSize?: number;
  memoryThreshold?: number; // MB
  timeout?: number; // milliseconds
  enableProgressTracking?: boolean;
}

export interface StreamProgress {
  totalProcessed: number;
  totalBatches: number;
  currentBatch: number;
  estimatedRemaining: number;
  memoryUsage: NodeJS.MemoryUsage;
  startTime: Date;
}

@Injectable()
export class StreamingService implements OnModuleInit {
  private readonly logger = new Logger(StreamingService.name);
  private readonly DEFAULT_BATCH_SIZE = 1000;
  private readonly DEFAULT_MEMORY_THRESHOLD = 512; // MB
  private readonly DEFAULT_TIMEOUT = 300000; // 5 minutes

  constructor(
    private prisma: PrismaService,
    private performanceMonitor: PerformanceMonitorService,
  ) {}

  async onModuleInit() {
    this.logger.log('Streaming service initialized');
  }

  // Generic streaming for large datasets
  async streamLargeDataset<T>(
    queryName: string,
    fetchBatch: (offset: number, limit: number) => Promise<T[]>,
    processor: (batch: T[], batchNumber: number) => Promise<void>,
    options: StreamOptions = {}
  ): Promise<{ totalProcessed: number; duration: number }> {
    const startTime = Date.now();
    const {
      batchSize = this.DEFAULT_BATCH_SIZE,
      memoryThreshold = this.DEFAULT_MEMORY_THRESHOLD,
      timeout = this.DEFAULT_TIMEOUT,
      enableProgressTracking = true,
    } = options;

    let offset = 0;
    let totalProcessed = 0;
    let currentBatch = 0;
    let hasMore = true;

    // Set timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Streaming timeout')), timeout);
    });

    const streamingPromise = (async () => {
      while (hasMore) {
        // Memory management check
        const memoryUsage = process.memoryUsage();
        const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;

        if (memoryUsageMB > memoryThreshold) {
          this.logger.warn(`Memory threshold exceeded: ${memoryUsageMB.toFixed(2)}MB > ${memoryThreshold}MB`);
          await this.performMemoryCleanup();
        }

        try {
          // Fetch batch
          const batch = await fetchBatch(offset, batchSize);

          if (batch && batch.length > 0) {
            // Process batch
            await processor(batch, currentBatch);

            totalProcessed += batch.length;
            offset += batch.length;
            currentBatch++;

            // Progress tracking
            if (enableProgressTracking && currentBatch % 10 === 0) {
              const progress: StreamProgress = {
                totalProcessed,
                totalBatches: currentBatch,
                currentBatch,
                estimatedRemaining: this.calculateRemainingTime(startTime, totalProcessed, batch.length),
                memoryUsage,
                startTime: new Date(startTime),
              };

              this.performanceMonitor.emit('streamProgress', {
                queryName,
                progress,
                timestamp: new Date(),
              });

              this.logger.debug(
                `Streaming progress: ${queryName} - ${totalProcessed} records processed, batch ${currentBatch}`
              );
            }

            // Periodic memory cleanup
            if (currentBatch % 50 === 0) {
              await this.performMemoryCleanup();
            }
          } else {
            hasMore = false;
          }
        } catch (error) {
          this.logger.error(`Error in streaming batch ${currentBatch} for ${queryName}:`, error);
          this.performanceMonitor.recordError(queryName, error);
          throw error;
        }
      }
    })();

    // Race between streaming and timeout
    try {
      await Promise.race([streamingPromise, timeoutPromise]);
    } catch (error) {
      if (error.message === 'Streaming timeout') {
        this.logger.error(`Streaming timeout for ${queryName} after ${timeout}ms`);
        throw new Error(`Streaming operation timed out after ${timeout}ms`);
      }
      throw error;
    }

    const duration = Date.now() - startTime;
    this.performanceMonitor.recordQueryTime(queryName, duration, true);

    this.logger.log(
      `Streaming completed for ${queryName}: ${totalProcessed} records processed in ${duration}ms`
    );

    return { totalProcessed, duration };
  }

  // Patient data streaming with pagination
  async streamPatientsWithPagination(
    processor: (patients: any[], batchNumber: number) => Promise<void>,
    centerId?: string,
    options: StreamOptions = {}
  ): Promise<{ totalProcessed: number; duration: number }> {
    return this.streamLargeDataset(
      'stream_patients',
      async (offset, limit) => {
        const whereClause = centerId ? { centerId } : {};

        return await this.prisma.patient.findMany({
          where: whereClause,
          include: {
            diagnoses: {
              take: 5, // Limit related data to prevent memory bloat
              select: {
                diagnosisName: true,
                diagnosisType: true,
                createdAt: true,
              },
            },
            medicalRecords: {
              take: 3,
              select: {
                recordType: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit,
        });
      },
      processor,
      options
    );
  }

  // Analytics data streaming
  async streamCancerAnalytics(
    filters: {
      startDate?: Date;
      endDate?: Date;
      province?: string;
      cancerType?: string;
    },
    processor: (data: any[], batchNumber: number) => Promise<void>,
    options: StreamOptions = {}
  ): Promise<{ totalProcessed: number; duration: number }> {
    return this.streamLargeDataset(
      'stream_cancer_analytics',
      async (offset, limit) => {
        const whereClause: any = {};

        if (filters.startDate || filters.endDate) {
          whereClause.createdAt = {};
          if (filters.startDate) whereClause.createdAt.gte = filters.startDate;
          if (filters.endDate) whereClause.createdAt.lte = filters.endDate;
        }

        if (filters.province) whereClause.province = filters.province;
        if (filters.cancerType) whereClause.cancerType = filters.cancerType;

        return await this.prisma.cancerGeographicData.findMany({
          where: whereClause,
          orderBy: { year: 'desc' },
          skip: offset,
          take: limit,
        });
      },
      processor,
      options
    );
  }

  // Create readable stream for API responses
  createPatientStream(centerId?: string): Readable {
    let offset = 0;
    const batchSize = 100;

    const stream = new Readable({
      objectMode: true,
      highWaterMark: 10,
      read() {
        // This will be called when the stream is ready for more data
      },
    });

    const pushData = async () => {
      try {
        const whereClause = centerId ? { centerId } : {};

        const patients = await this.prisma.patient.findMany({
          where: whereClause,
          select: {
            id: true,
            medicalRecordNumber: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            province: true,
            createdAt: true,
          },
          skip: offset,
          take: batchSize,
          orderBy: { createdAt: 'desc' },
        });

        if (patients.length === 0) {
          stream.push(null); // End of stream
          return;
        }

        for (const patient of patients) {
          stream.push(patient);
        }

        offset += batchSize;

        // Continue pushing data
        setImmediate(pushData);
      } catch (error) {
        stream.destroy(error);
      }
    };

    // Start pushing data
    setImmediate(pushData);

    return stream;
  }

  // Create CSV stream for large exports
  createCsvStream<T>(
    dataStream: Readable,
    headers: string[],
    rowMapper: (data: T) => string[]
  ): Readable {
    let isFirstRow = true;

    const transformStream = new Transform({
      objectMode: true,
      transform(data: T, encoding, callback) {
        try {
          if (isFirstRow) {
            // Push headers first
            this.push(headers.join(',') + '\n');
            isFirstRow = false;
          }

          // Map data to CSV row
          const row = rowMapper(data).map(cell => {
            // Escape CSV special characters
            const cellStr = String(cell || '');
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          });

          this.push(row.join(',') + '\n');
          callback();
        } catch (error) {
          callback(error);
        }
      },
    });

    dataStream.pipe(transformStream);
    return transformStream;
  }

  // Batch processing utilities
  async processBatchWithRetry<T>(
    items: T[],
    processor: (batch: T[], batchNumber: number) => Promise<void>,
    options: {
      batchSize?: number;
      maxRetries?: number;
      retryDelay?: number;
      parallelBatches?: number;
    } = {}
  ): Promise<{ totalProcessed: number; failedBatches: number }> {
    const {
      batchSize = this.DEFAULT_BATCH_SIZE,
      maxRetries = 3,
      retryDelay = 1000,
      parallelBatches = 1,
    } = options;

    let totalProcessed = 0;
    let failedBatches = 0;

    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    // Process batches in parallel with controlled concurrency
    const processBatch = async (batch: T[], batchNumber: number) => {
      let retries = 0;

      while (retries <= maxRetries) {
        try {
          await processor(batch, batchNumber);
          totalProcessed += batch.length;
          return;
        } catch (error) {
          retries++;
          if (retries > maxRetries) {
            this.logger.error(`Batch ${batchNumber} failed after ${maxRetries} retries:`, error);
            failedBatches++;
            this.performanceMonitor.recordError('batch_processing', error);
            return;
          }

          this.logger.warn(`Batch ${batchNumber} failed, retrying (${retries}/${maxRetries}):`, error.message);
          await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
        }
      }
    };

    // Process batches with controlled parallelism
    for (let i = 0; i < batches.length; i += parallelBatches) {
      const currentBatchPromises = batches
        .slice(i, i + parallelBatches)
        .map((batch, index) => processBatch(batch, i + index));

      await Promise.all(currentBatchPromises);

      // Memory cleanup between batch groups
      if (i % (parallelBatches * 10) === 0) {
        await this.performMemoryCleanup();
      }
    }

    return { totalProcessed, failedBatches };
  }

  // Memory management utilities
  private async performMemoryCleanup(): Promise<void> {
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Small delay to allow GC to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      this.logger.debug('Memory cleanup performed');
    } catch (error) {
      this.logger.error('Memory cleanup failed:', error);
    }
  }

  private calculateRemainingTime(
    startTime: number,
    totalProcessed: number,
    batchSize: number
  ): number {
    const elapsedTime = Date.now() - startTime;
    if (totalProcessed === 0 || elapsedTime === 0) return 0;

    const avgTimePerRecord = elapsedTime / totalProcessed;
    const estimatedRecordsPerSecond = 1000 / avgTimePerRecord;
    const estimatedTimePerBatch = (batchSize * 1000) / estimatedRecordsPerSecond;

    return estimatedTimePerBatch;
  }

  // Memory usage monitoring
  async getMemoryUsage(): Promise<{
    current: NodeJS.MemoryUsage;
    percentage: number;
    threshold: number;
    isAboveThreshold: boolean;
  }> {
    const memoryUsage = process.memoryUsage();
    const percentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;

    return {
      current: memoryUsage,
      percentage,
      threshold: this.DEFAULT_MEMORY_THRESHOLD,
      isAboveThreshold: percentage > this.DEFAULT_MEMORY_THRESHOLD,
    };
  }

  // Create optimized query with pagination and limits
  createOptimizedQuery<T>(
    model: any,
    options: {
      where?: any;
      select?: any;
      include?: any;
      orderBy?: any;
      batchSize?: number;
      maxResults?: number;
    } = {}
  ) {
    const {
      where = {},
      select,
      include,
      orderBy = { id: 'asc' },
      batchSize = this.DEFAULT_BATCH_SIZE,
      maxResults,
    } = options;

    return {
      async fetchBatch(offset: number): Promise<T[]> {
        const query: any = {
          where,
          orderBy,
          skip: offset,
          take: Math.min(batchSize, maxResults ? maxResults - offset : batchSize),
        };

        if (select) query.select = select;
        if (include) query.include = include;

        return await model.findMany(query);
      },
      async getTotalCount(): Promise<number> {
        return await model.count({ where });
      },
    };
  }
}