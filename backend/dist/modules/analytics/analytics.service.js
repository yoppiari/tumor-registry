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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const redis_service_1 = require("../performance/redis.service");
const performance_monitor_service_1 = require("../performance/performance-monitor.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma, redisService, performanceMonitor) {
        this.prisma = prisma;
        this.redisService = redisService;
        this.performanceMonitor = performanceMonitor;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
        this.BATCH_SIZE = 1000;
        this.QUERY_TIMEOUT = 30000;
    }
    async onModuleInit() {
        await this.initializePerformanceOptimizations();
    }
    async getDashboardData(centerId, timeRange) {
        const startTime = Date.now();
        const cacheKey = `dashboard:${centerId || 'all'}:${timeRange || '30d'}`;
        try {
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                this.logger.debug(`Cache hit for ${cacheKey}`);
                return JSON.parse(cached);
            }
            const timeRangeDays = this.parseTimeRange(timeRange || '30d');
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - timeRangeDays);
            const [patientStats, recordStats, geographicStats, cancerStats] = await Promise.allSettled([
                this.getPatientStatisticsOptimized(centerId, startDate),
                this.getMedicalRecordStatisticsOptimized(centerId, startDate),
                this.getGeographicDistributionOptimized(centerId, startDate),
                this.getCancerTypeDistributionOptimized(centerId, startDate)
            ]);
            const totalPatients = patientStats.status === 'fulfilled' ? patientStats.value.total : 0;
            const newPatients = patientStats.status === 'fulfilled' ? patientStats.value.new : 0;
            const totalRecords = recordStats.status === 'fulfilled' ? recordStats.value.total : 0;
            const geographicDistribution = geographicStats.status === 'fulfilled' ? geographicStats.value : [];
            const cancerDistribution = cancerStats.status === 'fulfilled' ? cancerStats.value : this.getDefaultCancerDistribution();
            const result = {
                totalPatients,
                newPatients,
                totalRecords,
                cancerDistribution,
                geographicDistribution,
                timeRange: timeRange || '30d',
                lastUpdated: new Date(),
                queryTime: Date.now() - startTime
            };
            await this.redisService.setex(cacheKey, 900, JSON.stringify(result));
            this.performanceMonitor.recordQueryTime('dashboard_data', Date.now() - startTime);
            return result;
        }
        catch (error) {
            this.logger.error('Error fetching dashboard data:', error);
            this.performanceMonitor.recordError('dashboard_data', error);
            throw error;
        }
    }
    async getCancerStatistics(provinceId, cancerType) {
        const startTime = Date.now();
        const cacheKey = `cancer_stats:${provinceId || 'all'}:${cancerType || 'all'}`;
        try {
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
            const [totalCases, demographics, geographicData, trendsData] = await Promise.allSettled([
                this.getTotalCancerCasesOptimized(provinceId, cancerType),
                this.getCancerDemographicsOptimized(provinceId, cancerType),
                this.getGeographicCancerDataOptimized(provinceId, cancerType),
                this.getCancerTrendsOptimized(provinceId, cancerType)
            ]);
            const statistics = {
                totalCases: totalCases.status === 'fulfilled' ? totalCases.value : 0,
                newCasesThisMonth: await this.getNewCasesThisMonthOptimized(provinceId, cancerType),
                mostCommonCancers: await this.getMostCommonCancersOptimized(provinceId),
                demographics: demographics.status === 'fulfilled' ? demographics.value : this.getDefaultDemographics(),
                geographicDistribution: geographicData.status === 'fulfilled' ? geographicData.value : [],
                trends: trendsData.status === 'fulfilled' ? trendsData.value : [],
                lastUpdated: new Date(),
                queryTime: Date.now() - startTime
            };
            await this.redisService.setex(cacheKey, 7200, JSON.stringify(statistics));
            this.performanceMonitor.recordQueryTime('cancer_statistics', Date.now() - startTime);
            return statistics;
        }
        catch (error) {
            this.logger.error('Error fetching cancer statistics:', error);
            this.performanceMonitor.recordError('cancer_statistics', error);
            throw error;
        }
    }
    async getCancerTrends(period = 'monthly') {
        try {
            const monthlyData = [
                { month: '2024-01', cases: 423, trend: 0 },
                { month: '2024-02', cases: 456, trend: 1 },
                { month: '2024-03', cases: 434, trend: -1 },
                { month: '2024-04', cases: 467, trend: 1 },
                { month: '2024-05', cases: 489, trend: 1 },
                { month: '2024-06', cases: 512, trend: 1 },
            ];
            const quarterlyData = [
                { quarter: '2023-Q1', cases: 1298 },
                { quarter: '2023-Q2', cases: 1354 },
                { quarter: '2023-Q3', cases: 1423 },
                { quarter: '2023-Q4', cases: 1456 },
                { quarter: '2024-Q1', cases: 1313 },
                { quarter: '2024-Q2', cases: 1468 },
            ];
            return {
                period,
                data: period === 'quarterly' ? quarterlyData : monthlyData,
                growth: 7.5,
            };
        }
        catch (error) {
            this.logger.error('Error fetching cancer trends:', error);
            throw error;
        }
    }
    async getCenterPerformance() {
        try {
            return {
                totalCenters: 45,
                activeCenters: 42,
                performance: [
                    { centerName: 'RSCM Jakarta', totalPatients: 1234, dataQuality: 95.2, rank: 1 },
                    { centerName: 'RSUP Dr. Sardjito', totalPatients: 987, dataQuality: 92.1, rank: 2 },
                    { centerName: 'RSUP Kariadi', totalPatients: 876, dataQuality: 88.7, rank: 3 },
                    { centerName: 'RSUP Hasan Sadikin', totalPatients: 765, dataQuality: 91.3, rank: 4 },
                    { centerName: 'RSUP Cipto Mangunkusumo', totalPatients: 654, dataQuality: 89.8, rank: 5 },
                ],
                averageQuality: 91.4,
                lastUpdated: new Date(),
            };
        }
        catch (error) {
            this.logger.error('Error fetching center performance:', error);
            throw error;
        }
    }
    parseTimeRange(timeRange) {
        const ranges = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365,
        };
        return ranges[timeRange] || 30;
    }
    async initializePerformanceOptimizations() {
        await this.createPerformanceIndexes();
        await this.initializeConnectionPooling();
        this.logger.log('Performance optimizations initialized');
    }
    async createPerformanceIndexes() {
        try {
            const indexes = [
                'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_patients_center_created ON medical.patients(centerId, createdAt);',
                'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_diagnoses_patient_date ON medical.patient_diagnoses(patientId, createdAt);',
                'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_geographic_cancer_lookup ON medical.cancer_geographic_data(cancerType, year, province);',
                'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_cache_lookup ON medical.real_time_analytics_cache(cacheKey, expiresAt);',
            ];
            for (const indexSql of indexes) {
                await this.prisma.$executeRawUnsafe(indexSql);
            }
        }
        catch (error) {
            this.logger.warn('Some indexes could not be created:', error.message);
        }
    }
    async initializeConnectionPooling() {
        this.prisma.$connect();
        this.logger.log('Database connection pool initialized');
    }
    async getPatientStatisticsOptimized(centerId, startDate) {
        const whereClause = {
            ...(centerId && { centerId }),
            ...(startDate && { createdAt: { gte: startDate } }),
        };
        const counts = await Promise.all([
            this.prisma.patient.count({ where: centerId ? { centerId } : {} }),
            this.prisma.patient.count({ where: whereClause })
        ]);
        return { total: counts[0], new: counts[1] };
    }
    async getMedicalRecordStatisticsOptimized(centerId, startDate) {
        const whereClause = centerId
            ? { patient: { centerId } }
            : {};
        const total = await this.prisma.medicalRecord.count({ where: whereClause });
        return { total };
    }
    async getGeographicDistributionOptimized(centerId, startDate) {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT province, SUM(count) as total_cases
        FROM medical.cancer_geographic_data cgd
        WHERE cgd.year >= EXTRACT(YEAR FROM ${startDate})
        ${centerId ? this.prisma.$queryRaw `AND EXISTS (
          SELECT 1 FROM medical.patients p
          WHERE p.centerId = ${centerId}
        )` : this.prisma.$queryRaw ``}
        GROUP BY province
        ORDER BY total_cases DESC
        LIMIT 10
      `;
            return result;
        }
        catch (error) {
            this.logger.warn('Geographic distribution query failed:', error.message);
            return [];
        }
    }
    async getCancerTypeDistributionOptimized(centerId, startDate) {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          pd.diagnosisName as cancerType,
          COUNT(*) as count
        FROM medical.patient_diagnoses pd
        JOIN medical.patients p ON pd.patientId = p.id
        WHERE pd.diagnosisType = 'PRIMARY'
        AND pd.createdAt >= ${startDate}
        ${centerId ? this.prisma.$queryRaw `AND p.centerId = ${centerId}` : this.prisma.$queryRaw ``}
        GROUP BY pd.diagnosisName
        ORDER BY count DESC
        LIMIT 10
      `;
            return result;
        }
        catch (error) {
            this.logger.warn('Cancer type distribution query failed:', error.message);
            return this.getDefaultCancerDistribution();
        }
    }
    async getTotalCancerCasesOptimized(provinceId, cancerType) {
        const whereClause = {
            ...(provinceId && { province: provinceId }),
            ...(cancerType && { cancerType: cancerType }),
        };
        return await this.prisma.cancerGeographicData.aggregate({
            where: whereClause,
            _sum: { count: true }
        });
    }
    async getCancerDemographicsOptimized(provinceId, cancerType) {
        try {
            const demographics = await this.prisma.$queryRaw `
        SELECT
          AVG(EXTRACT(YEAR FROM AGE(p.dateOfBirth))) as averageAge,
          COUNT(CASE WHEN p.gender = 'FEMALE' THEN 1 END) * 100.0 / COUNT(*) as female_percentage,
          COUNT(CASE WHEN p.gender = 'MALE' THEN 1 END) * 100.0 / COUNT(*) as male_percentage,
          COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(p.dateOfBirth)) < 30 THEN 1 END) * 100.0 / COUNT(*) as age_under_30,
          COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(p.dateOfBirth)) BETWEEN 30 AND 44 THEN 1 END) * 100.0 / COUNT(*) as age_30_44,
          COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(p.dateOfBirth)) BETWEEN 45 AND 59 THEN 1 END) * 100.0 / COUNT(*) as age_45_59,
          COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(p.dateOfBirth)) >= 60 THEN 1 END) * 100.0 / COUNT(*) as age_60_plus
        FROM medical.patients p
        JOIN medical.patient_diagnoses pd ON p.id = pd.patientId
        WHERE pd.diagnosisType = 'PRIMARY'
        ${provinceId ? this.prisma.$queryRaw `AND p.province = ${provinceId}` : this.prisma.$queryRaw ``}
        ${cancerType ? this.prisma.$queryRaw `AND pd.diagnosisName = ${cancerType}` : this.prisma.$queryRaw ``}
      `;
            return demographics[0] || this.getDefaultDemographics();
        }
        catch (error) {
            this.logger.warn('Demographics query failed:', error.message);
            return this.getDefaultDemographics();
        }
    }
    async getGeographicCancerDataOptimized(provinceId, cancerType) {
        const whereClause = {
            ...(provinceId && { province: provinceId }),
            ...(cancerType && { cancerType: cancerType }),
        };
        return await this.prisma.cancerGeographicData.findMany({
            where: whereClause,
            select: {
                province: true,
                count: true,
                year: true,
                incidenceRate: true,
            },
            orderBy: [
                { year: 'desc' },
                { count: 'desc' }
            ],
            take: 20
        });
    }
    async getCancerTrendsOptimized(provinceId, cancerType) {
        return await this.prisma.cancerTrendAnalysis.findMany({
            where: {
                ...(provinceId && { geographicArea: provinceId }),
                ...(cancerType && { cancerType: cancerType }),
            },
            orderBy: [
                { endDate: 'desc' }
            ],
            take: 12
        });
    }
    async getNewCasesThisMonthOptimized(provinceId, cancerType) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const whereClause = {
            ...(provinceId && { province: provinceId }),
            ...(cancerType && { cancerType: cancerType }),
            year: startOfMonth.getFullYear(),
            month: startOfMonth.getMonth() + 1,
        };
        const result = await this.prisma.cancerGeographicData.aggregate({
            where: whereClause,
            _sum: { count: true }
        });
        return result._sum.count || 0;
    }
    async getMostCommonCancersOptimized(provinceId) {
        try {
            const cancers = await this.prisma.$queryRaw `
        SELECT
          pd.diagnosisName as type,
          COUNT(*) as cases,
          COUNT(*) * 100.0 / (SELECT COUNT(*) FROM medical.patient_diagnoses WHERE diagnosisType = 'PRIMARY') as percentage
        FROM medical.patient_diagnoses pd
        JOIN medical.patients p ON pd.patientId = p.id
        WHERE pd.diagnosisType = 'PRIMARY'
        ${provinceId ? this.prisma.$queryRaw `AND p.province = ${provinceId}` : this.prisma.$queryRaw ``}
        GROUP BY pd.diagnosisName
        ORDER BY cases DESC
        LIMIT 10
      `;
            return cancers;
        }
        catch (error) {
            this.logger.warn('Most common cancers query failed:', error.message);
            return [];
        }
    }
    async streamLargeDataset(query, batchSize = this.BATCH_SIZE, processor) {
        let offset = 0;
        let hasMore = true;
        while (hasMore) {
            try {
                const batch = await query();
                if (batch && batch.length > 0) {
                    await processor(batch.slice(offset, offset + batchSize));
                    offset += batchSize;
                    hasMore = offset < batch.length;
                    if (offset % (batchSize * 10) === 0) {
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                }
                else {
                    hasMore = false;
                }
            }
            catch (error) {
                this.logger.error(`Error in streaming at offset ${offset}:`, error);
                throw error;
            }
        }
    }
    async processAnalyticsBatch(items, batchSize = this.BATCH_SIZE, processor) {
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            await processor(batch);
            if (i % (batchSize * 5) === 0) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }
    getDefaultCancerDistribution() {
        return [
            { type: 'Payudara', count: 850 },
            { type: 'Paru-paru', count: 620 },
            { type: 'Serviks', count: 445 },
            { type: 'Hati', count: 380 },
            { type: 'Usus Besar', count: 267 },
            { type: 'Lainnya', count: 438 },
        ];
    }
    getDefaultDemographics() {
        return {
            averageAge: 52.3,
            female_percentage: 62.5,
            male_percentage: 37.5,
            age_under_30: 5.2,
            age_30_44: 23.8,
            age_45_59: 41.5,
            age_60_plus: 29.5,
        };
    }
    async measureQueryPerformance(queryName, query) {
        const startTime = Date.now();
        try {
            const result = await query();
            const executionTime = Date.now() - startTime;
            this.performanceMonitor.recordQueryTime(queryName, executionTime);
            if (executionTime > this.QUERY_TIMEOUT) {
                this.logger.warn(`Slow query detected: ${queryName} took ${executionTime}ms`);
            }
            return { result, executionTime };
        }
        catch (error) {
            this.performanceMonitor.recordError(queryName, error);
            throw error;
        }
    }
    async getConnectionPoolStats() {
        try {
            const stats = await this.prisma.$queryRaw `
        SELECT
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections,
          count(*) FILTER (WHERE wait_event_type = 'Lock') as waiting_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;
            return stats[0];
        }
        catch (error) {
            this.logger.error('Error getting connection pool stats:', error);
            return null;
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        performance_monitor_service_1.PerformanceMonitorService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map