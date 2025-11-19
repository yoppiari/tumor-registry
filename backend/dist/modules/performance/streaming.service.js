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
var StreamingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const performance_monitor_service_1 = require("./performance-monitor.service");
const stream_1 = require("stream");
let StreamingService = StreamingService_1 = class StreamingService {
    constructor(prisma, performanceMonitor) {
        this.prisma = prisma;
        this.performanceMonitor = performanceMonitor;
        this.logger = new common_1.Logger(StreamingService_1.name);
        this.DEFAULT_BATCH_SIZE = 1000;
        this.DEFAULT_MEMORY_THRESHOLD = 512;
        this.DEFAULT_TIMEOUT = 300000;
    }
    async onModuleInit() {
        this.logger.log('Streaming service initialized');
    }
    async streamLargeDataset(queryName, fetchBatch, processor, options = {}) {
        const startTime = Date.now();
        const { batchSize = this.DEFAULT_BATCH_SIZE, memoryThreshold = this.DEFAULT_MEMORY_THRESHOLD, timeout = this.DEFAULT_TIMEOUT, enableProgressTracking = true, } = options;
        let offset = 0;
        let totalProcessed = 0;
        let currentBatch = 0;
        let hasMore = true;
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Streaming timeout')), timeout);
        });
        const streamingPromise = (async () => {
            while (hasMore) {
                const memoryUsage = process.memoryUsage();
                const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
                if (memoryUsageMB > memoryThreshold) {
                    this.logger.warn(`Memory threshold exceeded: ${memoryUsageMB.toFixed(2)}MB > ${memoryThreshold}MB`);
                    await this.performMemoryCleanup();
                }
                try {
                    const batch = await fetchBatch(offset, batchSize);
                    if (batch && batch.length > 0) {
                        await processor(batch, currentBatch);
                        totalProcessed += batch.length;
                        offset += batch.length;
                        currentBatch++;
                        if (enableProgressTracking && currentBatch % 10 === 0) {
                            const progress = {
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
                            this.logger.debug(`Streaming progress: ${queryName} - ${totalProcessed} records processed, batch ${currentBatch}`);
                        }
                        if (currentBatch % 50 === 0) {
                            await this.performMemoryCleanup();
                        }
                    }
                    else {
                        hasMore = false;
                    }
                }
                catch (error) {
                    this.logger.error(`Error in streaming batch ${currentBatch} for ${queryName}:`, error);
                    this.performanceMonitor.recordError(queryName, error);
                    throw error;
                }
            }
        })();
        try {
            await Promise.race([streamingPromise, timeoutPromise]);
        }
        catch (error) {
            if (error.message === 'Streaming timeout') {
                this.logger.error(`Streaming timeout for ${queryName} after ${timeout}ms`);
                throw new Error(`Streaming operation timed out after ${timeout}ms`);
            }
            throw error;
        }
        const duration = Date.now() - startTime;
        this.performanceMonitor.recordQueryTime(queryName, duration, true);
        this.logger.log(`Streaming completed for ${queryName}: ${totalProcessed} records processed in ${duration}ms`);
        return { totalProcessed, duration };
    }
    async streamPatientsWithPagination(centerId, processor, options = {}) {
        return this.streamLargeDataset('stream_patients', async (offset, limit) => {
            const whereClause = centerId ? { centerId } : {};
            return await this.prisma.patient.findMany({
                where: whereClause,
                include: {
                    diagnoses: {
                        take: 5,
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
        }, processor, options);
    }
    async streamCancerAnalytics(filters, processor, options = {}) {
        return this.streamLargeDataset('stream_cancer_analytics', async (offset, limit) => {
            const whereClause = {};
            if (filters.startDate || filters.endDate) {
                whereClause.createdAt = {};
                if (filters.startDate)
                    whereClause.createdAt.gte = filters.startDate;
                if (filters.endDate)
                    whereClause.createdAt.lte = filters.endDate;
            }
            if (filters.province)
                whereClause.province = filters.province;
            if (filters.cancerType)
                whereClause.cancerType = filters.cancerType;
            return await this.prisma.cancerGeographicData.findMany({
                where: whereClause,
                include: {},
                orderBy: { year: 'desc' },
                skip: offset,
                take: limit,
            });
        }, processor, options);
    }
    createPatientStream(centerId) {
        let offset = 0;
        const batchSize = 100;
        const stream = new stream_1.Readable({
            objectMode: true,
            highWaterMark: 10,
            read() {
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
                    stream.push(null);
                    return;
                }
                for (const patient of patients) {
                    stream.push(patient);
                }
                offset += batchSize;
                setImmediate(pushData);
            }
            catch (error) {
                stream.destroy(error);
            }
        };
        setImmediate(pushData);
        return stream;
    }
    createCsvStream(dataStream, headers, rowMapper) {
        let isFirstRow = true;
        const transformStream = new stream_1.Transform({
            objectMode: true,
            transform(data, encoding, callback) {
                try {
                    if (isFirstRow) {
                        this.push(headers.join(',') + '\n');
                        isFirstRow = false;
                    }
                    const row = rowMapper(data).map(cell => {
                        const cellStr = String(cell || '');
                        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                            return `"${cellStr.replace(/"/g, '""')}"`;
                        }
                        return cellStr;
                    });
                    this.push(row.join(',') + '\n');
                    callback();
                }
                catch (error) {
                    callback(error);
                }
            },
        });
        dataStream.pipe(transformStream);
        return transformStream;
    }
    async processBatchWithRetry(items, processor, options = {}) {
        const { batchSize = this.DEFAULT_BATCH_SIZE, maxRetries = 3, retryDelay = 1000, parallelBatches = 1, } = options;
        let totalProcessed = 0;
        let failedBatches = 0;
        const batches = [];
        for (let i = 0; i < items.length; i += batchSize) {
            batches.push(items.slice(i, i + batchSize));
        }
        const processBatch = async (batch, batchNumber) => {
            let retries = 0;
            while (retries <= maxRetries) {
                try {
                    await processor(batch, batchNumber);
                    totalProcessed += batch.length;
                    return;
                }
                catch (error) {
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
        for (let i = 0; i < batches.length; i += parallelBatches) {
            const currentBatchPromises = batches
                .slice(i, i + parallelBatches)
                .map((batch, index) => processBatch(batch, i + index));
            await Promise.all(currentBatchPromises);
            if (i % (parallelBatches * 10) === 0) {
                await this.performMemoryCleanup();
            }
        }
        return { totalProcessed, failedBatches };
    }
    async performMemoryCleanup() {
        try {
            if (global.gc) {
                global.gc();
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            this.logger.debug('Memory cleanup performed');
        }
        catch (error) {
            this.logger.error('Memory cleanup failed:', error);
        }
    }
    calculateRemainingTime(startTime, totalProcessed, batchSize) {
        const elapsedTime = Date.now() - startTime;
        if (totalProcessed === 0 || elapsedTime === 0)
            return 0;
        const avgTimePerRecord = elapsedTime / totalProcessed;
        const estimatedRecordsPerSecond = 1000 / avgTimePerRecord;
        const estimatedTimePerBatch = (batchSize * 1000) / estimatedRecordsPerSecond;
        return estimatedTimePerBatch;
    }
    async getMemoryUsage() {
        const memoryUsage = process.memoryUsage();
        const percentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
        return {
            current: memoryUsage,
            percentage,
            threshold: this.DEFAULT_MEMORY_THRESHOLD,
            isAboveThreshold: percentage > this.DEFAULT_MEMORY_THRESHOLD,
        };
    }
    createOptimizedQuery(model, options = {}) {
        const { where = {}, select, include, orderBy = { id: 'asc' }, batchSize = this.DEFAULT_BATCH_SIZE, maxResults, } = options;
        return {
            async fetchBatch(offset) {
                const query = {
                    where,
                    orderBy,
                    skip: offset,
                    take: Math.min(batchSize, maxResults ? maxResults - offset : batchSize),
                };
                if (select)
                    query.select = select;
                if (include)
                    query.include = include;
                return await model.findMany(query);
            },
            async getTotalCount() {
                return await model.count({ where });
            },
        };
    }
};
exports.StreamingService = StreamingService;
exports.StreamingService = StreamingService = StreamingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        performance_monitor_service_1.PerformanceMonitorService])
], StreamingService);
//# sourceMappingURL=streaming.service.js.map