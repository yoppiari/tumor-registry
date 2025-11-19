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
var DatabasePerformanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabasePerformanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const performance_monitor_service_1 = require("./performance-monitor.service");
const schedule_1 = require("@nestjs/schedule");
let DatabasePerformanceService = DatabasePerformanceService_1 = class DatabasePerformanceService {
    constructor(prisma, performanceMonitor) {
        this.prisma = prisma;
        this.performanceMonitor = performanceMonitor;
        this.logger = new common_1.Logger(DatabasePerformanceService_1.name);
        this.metricsHistory = [];
        this.maxHistorySize = 1440;
        this.slowQueryThreshold = 1000;
    }
    async onModuleInit() {
        await this.initializeDatabaseMonitoring();
        this.logger.log('Database performance monitoring initialized');
    }
    async initializeDatabaseMonitoring() {
        try {
            await this.prisma.$executeRaw `CREATE EXTENSION IF NOT EXISTS pg_stat_statements;`;
            await this.createPerformanceViews();
            this.logger.log('Database monitoring extensions initialized');
        }
        catch (error) {
            this.logger.warn('Could not initialize all database monitoring features:', error.message);
        }
    }
    async createPerformanceViews() {
        try {
            await this.prisma.$executeRaw `
        CREATE OR REPLACE VIEW slow_queries AS
        SELECT
          query,
          calls,
          total_exec_time as totalTime,
          mean_exec_time as meanTime,
          rows,
          first_exec_time as firstSeen
        FROM pg_stat_statements
        WHERE mean_exec_time > ${this.slowQueryThreshold / 1000}
        ORDER BY mean_exec_time DESC
        LIMIT 50;
      `;
            await this.prisma.$executeRaw `
        CREATE OR REPLACE VIEW index_usage AS
        SELECT
          schemaname,
          tablename,
          indexname,
          idx_scan as indexScans,
          idx_tup_read as tuplesRead,
          idx_tup_fetch as tuplesFetched
        FROM pg_stat_user_indexes
        ORDER BY idx_scan DESC;
      `;
            await this.prisma.$executeRaw `
        CREATE OR REPLACE VIEW table_statistics AS
        SELECT
          schemaname,
          tablename,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as liveTuples,
          n_dead_tup as deadTuples,
          last_vacuum,
          last_autovacuum,
          last_analyze,
          last_autoanalyze
        FROM pg_stat_user_tables;
      `;
        }
        catch (error) {
            this.logger.warn('Could not create performance views:', error.message);
        }
    }
    async collectDatabaseMetrics() {
        const startTime = Date.now();
        try {
            const [connectionStats, queryStats, indexStats, tableStats, cacheStats,] = await Promise.allSettled([
                this.getConnectionPoolStats(),
                this.getQueryPerformanceStats(),
                this.getIndexUsageStats(),
                this.getTableStatistics(),
                this.getCachePerformanceStats(),
            ]);
            const metrics = {
                timestamp: new Date(),
                connectionPool: connectionStats.status === 'fulfilled' ? connectionStats.value : this.getDefaultConnectionStats(),
                queryPerformance: queryStats.status === 'fulfilled' ? queryStats.value : this.getDefaultQueryStats(),
                indexUsage: indexStats.status === 'fulfilled' ? indexStats.value : this.getDefaultIndexStats(),
                tableStats: tableStats.status === 'fulfilled' ? tableStats.value : this.getDefaultTableStats(),
                cachePerformance: cacheStats.status === 'fulfilled' ? cacheStats.value : this.getDefaultCacheStats(),
            };
            this.metricsHistory.push(metrics);
            if (this.metricsHistory.length > this.maxHistorySize) {
                this.metricsHistory.shift();
            }
            this.performanceMonitor.emit('databaseMetrics', metrics);
            this.checkDatabaseAlerts(metrics);
            this.performanceMonitor.recordQueryTime('collect_database_metrics', Date.now() - startTime);
            return metrics;
        }
        catch (error) {
            this.logger.error('Failed to collect database metrics:', error);
            this.performanceMonitor.recordError('collect_database_metrics', error);
            throw error;
        }
    }
    async getConnectionPoolStats() {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          count(*) as total,
          count(*) FILTER (WHERE state = 'active') as active,
          count(*) FILTER (WHERE state = 'idle') as idle,
          count(*) FILTER (WHERE wait_event_type = 'Lock') as waiting
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;
            const stats = result[0];
            return {
                total: parseInt(stats.total),
                active: parseInt(stats.active),
                idle: parseInt(stats.idle),
                waiting: parseInt(stats.waiting),
            };
        }
        catch (error) {
            this.logger.error('Error getting connection pool stats:', error);
            return this.getDefaultConnectionStats();
        }
    }
    async getQueryPerformanceStats() {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          AVG(mean_exec_time * 1000) as averageTime,
          COUNT(*) FILTER (WHERE mean_exec_time > ${this.slowQueryThreshold / 1000}) as slowQueries,
          SUM(calls) as totalQueries,
          ROUND(SUM(calls) / EXTRACT(EPOCH FROM (NOW() - pg_stat_get_snapshot_timestamp()))) as queriesPerSecond
        FROM pg_stat_statements
      `;
            const stats = result[0];
            return {
                averageTime: parseFloat(stats.averageTime) || 0,
                slowQueries: parseInt(stats.slowQueries) || 0,
                totalQueries: parseInt(stats.totalQueries) || 0,
                queriesPerSecond: parseFloat(stats.queriesPerSecond) || 0,
            };
        }
        catch (error) {
            this.logger.error('Error getting query performance stats:', error);
            return this.getDefaultQueryStats();
        }
    }
    async getIndexUsageStats() {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          ROUND(
            (SUM(idx_scan)::numeric / NULLIF(SUM(idx_scan + seq_scan), 0)) * 100, 2
          ) as hitRate,
          COUNT(*) FILTER (WHERE idx_scan = 0) as unusedIndexes,
          COUNT(*) as totalIndexes
        FROM pg_stat_user_tables t
        JOIN pg_stat_user_indexes i ON t.relid = i.relid
      `;
            const stats = result[0];
            return {
                hitRate: parseFloat(stats.hitRate) || 0,
                unusedIndexes: parseInt(stats.unusedIndexes) || 0,
                totalIndexes: parseInt(stats.totalIndexes) || 0,
            };
        }
        catch (error) {
            this.logger.error('Error getting index usage stats:', error);
            return this.getDefaultIndexStats();
        }
    }
    async getTableStatistics() {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          COUNT(DISTINCT c.oid) as totalTables,
          COUNT(DISTINCT c.oid) FILTER (
            WHERE pg_total_relation_size(c.oid) > (
              pg_relation_size(c.oid) * 1.25
            )
          ) as bloatedTables,
          pg_size_pretty(SUM(pg_total_relation_size(c.oid))) as totalSize,
          SUM(n_live_tup) as totalRows
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        JOIN pg_stat_user_tables s ON s.relid = c.oid
        WHERE n.nspname IN ('medical', 'audit', 'system')
        AND c.relkind = 'r'
      `;
            const stats = result[0];
            return {
                totalTables: parseInt(stats.totalTables) || 0,
                bloatedTables: parseInt(stats.bloatedTables) || 0,
                totalSize: stats.totalSize || '0B',
                totalRows: parseInt(stats.totalRows) || 0,
            };
        }
        catch (error) {
            this.logger.error('Error getting table statistics:', error);
            return this.getDefaultTableStats();
        }
    }
    async getCachePerformanceStats() {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          ROUND((blks_hit::numeric / NULLIF(blks_hit + blks_read, 0)) * 100, 2) as hitRatio,
          pg_size_pretty(SUM(blks_hit + blks_read) * 8192) as size
        FROM pg_stat_database
        WHERE datname = current_database()
      `;
            const stats = result[0];
            return {
                hitRatio: parseFloat(stats.hitRatio) || 0,
                size: stats.size || '0B',
            };
        }
        catch (error) {
            this.logger.error('Error getting cache performance stats:', error);
            return this.getDefaultCacheStats();
        }
    }
    async getSlowQueries(limit = 20) {
        try {
            const result = await this.prisma.$queryRaw `
        SELECT
          pg_stat_statements.query as query,
          pg_stat_statements.calls as calls,
          ROUND(pg_stat_statements.total_exec_time * 1000) as totalTime,
          ROUND(pg_stat_statements.mean_exec_time * 1000) as meanTime,
          pg_stat_statements.rows as rows,
          pg_stat_statements.first_exec_time as firstSeen
        FROM pg_stat_statements
        WHERE pg_stat_statements.mean_exec_time > ${this.slowQueryThreshold / 1000}
        ORDER BY pg_stat_statements.mean_exec_time DESC
        LIMIT ${limit}
      `;
            return result.map(row => ({
                query: row.query,
                calls: parseInt(row.calls),
                totalTime: parseFloat(row.totalTime),
                meanTime: parseFloat(row.meanTime),
                rows: parseInt(row.rows),
                firstSeen: new Date(row.firstSeen),
            }));
        }
        catch (error) {
            this.logger.error('Error getting slow queries:', error);
            return [];
        }
    }
    async getOptimizationRecommendations() {
        const recommendations = [];
        const latestMetrics = this.metricsHistory[this.metricsHistory.length - 1];
        if (!latestMetrics)
            return recommendations;
        if (latestMetrics.connectionPool.waiting > 0) {
            recommendations.push({
                category: 'connection_pool',
                priority: 'high',
                title: 'Database Connection Pool Optimization',
                description: `${latestMetrics.connectionPool.waiting} queries waiting for connections`,
                impact: 'High - Can prevent timeout errors and improve response times',
                effort: 'Medium',
                actions: [
                    'Increase connection pool size',
                    'Implement connection timeout handling',
                    'Add connection pool monitoring',
                    'Consider connection pooling middleware',
                ],
            });
        }
        if (latestMetrics.queryPerformance.slowQueries > 0) {
            recommendations.push({
                category: 'query_performance',
                priority: 'critical',
                title: 'Slow Query Optimization',
                description: `${latestMetrics.queryPerformance.slowQueries} slow queries detected`,
                impact: 'Critical - Can significantly improve application performance',
                effort: 'Medium',
                actions: [
                    'Analyze and optimize slow queries',
                    'Add appropriate database indexes',
                    'Consider query caching strategies',
                    'Implement query timeouts',
                ],
            });
        }
        if (latestMetrics.indexUsage.unusedIndexes > 0) {
            recommendations.push({
                category: 'index_optimization',
                priority: 'medium',
                title: 'Remove Unused Indexes',
                description: `${latestMetrics.indexUsage.unusedIndexes} unused indexes found`,
                impact: 'Medium - Can improve write performance and reduce storage',
                effort: 'Low',
                actions: [
                    'Review and remove unused indexes',
                    'Analyze index usage patterns',
                    'Consider composite indexes',
                    'Schedule regular index maintenance',
                ],
            });
        }
        if (latestMetrics.tableStats.bloatedTables > 0) {
            recommendations.push({
                category: 'table_maintenance',
                priority: 'medium',
                title: 'Table Bloat Maintenance',
                description: `${latestMetrics.tableStats.bloatedTables} tables show high bloat levels`,
                impact: 'Medium - Can reclaim storage and improve query performance',
                effort: 'Low',
                actions: [
                    'Run VACUUM ANALYZE on bloated tables',
                    'Configure autovacuum settings',
                    'Consider table partitioning',
                    'Schedule regular maintenance windows',
                ],
            });
        }
        if (latestMetrics.cachePerformance.hitRatio < 90) {
            recommendations.push({
                category: 'cache_optimization',
                priority: 'medium',
                title: 'Improve Cache Hit Ratio',
                description: `Current cache hit ratio: ${latestMetrics.cachePerformance.hitRatio}%`,
                impact: 'Medium - Can reduce database load and improve response times',
                effort: 'Medium',
                actions: [
                    'Increase shared_buffers setting',
                    'Optimize query patterns',
                    'Implement application-level caching',
                    'Review cache invalidation strategy',
                ],
            });
        }
        return recommendations;
    }
    async performDailyMaintenance() {
        this.logger.log('Starting daily database maintenance');
        try {
            await Promise.allSettled([
                this.updateTableStatistics(),
                this.analyzeIndexUsage(),
                this.checkTableBloat(),
                this.refreshMaterializedViews(),
            ]);
            this.logger.log('Daily database maintenance completed');
        }
        catch (error) {
            this.logger.error('Daily database maintenance failed:', error);
        }
    }
    async updateTableStatistics() {
        try {
            const tables = ['patients', 'patient_diagnoses', 'cancer_geographic_data', 'medical_records'];
            for (const table of tables) {
                await this.prisma.$executeRawUnsafe `ANALYZE medical.${table}`;
            }
            this.logger.debug('Table statistics updated');
        }
        catch (error) {
            this.logger.error('Failed to update table statistics:', error);
        }
    }
    async analyzeIndexUsage() {
        try {
            await this.prisma.$executeRaw `
        SELECT pg_stat_reset_single_table_counter(oid)
        FROM pg_class
        WHERE relname IN ('patients', 'patient_diagnoses', 'cancer_geographic_data')
      `;
            this.logger.debug('Index usage analysis completed');
        }
        catch (error) {
            this.logger.error('Failed to analyze index usage:', error);
        }
    }
    async checkTableBloat() {
        try {
            const bloatedTables = await this.prisma.$queryRaw `
        SELECT schemaname, tablename,
               ROUND(100 * (pg_total_relation_size(schemaname||'.'||tablename) -
                           pg_relation_size(schemaname||'.'||tablename))::numeric /
                           pg_total_relation_size(schemaname||'.'||tablename), 2) as bloat_percentage
        FROM pg_tables
        WHERE schemaname IN ('medical', 'audit', 'system')
        HAVING pg_total_relation_size(schemaname||'.'||tablename) > 0
        ORDER BY bloat_percentage DESC
      `;
            this.logger.debug(`Table bloat check completed. Found ${bloatedTables.length} tables`);
        }
        catch (error) {
            this.logger.error('Failed to check table bloat:', error);
        }
    }
    async refreshMaterializedViews() {
        try {
            await this.prisma.$executeRaw `
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'cancer_aggregates_mv') THEN
            REFRESH MATERIALIZED VIEW CONCURRENTLY cancer_aggregates_mv;
          END IF;
        END $$;
      `;
            this.logger.debug('Materialized views refreshed');
        }
        catch (error) {
            this.logger.error('Failed to refresh materialized views:', error);
        }
    }
    checkDatabaseAlerts(metrics) {
        const alerts = [];
        if (metrics.connectionPool.waiting > 5) {
            alerts.push({
                type: 'connection_pool',
                severity: 'high',
                message: `${metrics.connectionPool.waiting} queries waiting for connections`,
            });
        }
        if (metrics.queryPerformance.slowQueries > 10) {
            alerts.push({
                type: 'slow_queries',
                severity: 'critical',
                message: `${metrics.queryPerformance.slowQueries} slow queries detected`,
            });
        }
        if (metrics.indexUsage.hitRatio < 85) {
            alerts.push({
                type: 'index_usage',
                severity: 'medium',
                message: `Low index hit ratio: ${metrics.indexUsage.hitRatio}%`,
            });
        }
        if (metrics.cachePerformance.hitRatio < 90) {
            alerts.push({
                type: 'cache_performance',
                severity: 'medium',
                message: `Low cache hit ratio: ${metrics.cachePerformance.hitRatio}%`,
            });
        }
        for (const alert of alerts) {
            this.performanceMonitor.emit('databaseAlert', { ...alert, timestamp: metrics.timestamp });
            this.logger.warn(`Database alert [${alert.type}]: ${alert.message}`);
        }
    }
    getDefaultConnectionStats() {
        return { total: 0, active: 0, idle: 0, waiting: 0 };
    }
    getDefaultQueryStats() {
        return { averageTime: 0, slowQueries: 0, totalQueries: 0, queriesPerSecond: 0 };
    }
    getDefaultIndexStats() {
        return { hitRate: 0, unusedIndexes: 0, totalIndexes: 0 };
    }
    getDefaultTableStats() {
        return { totalTables: 0, bloatedTables: 0, totalSize: '0B', totalRows: 0 };
    }
    getDefaultCacheStats() {
        return { hitRatio: 0, size: '0B' };
    }
    getMetricsHistory(hours = 24) {
        const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
        return this.metricsHistory.filter(m => m.timestamp >= cutoffTime);
    }
    async getHealthStatus() {
        try {
            const metrics = await this.collectDatabaseMetrics();
            const alerts = [];
            if (metrics.connectionPool.waiting > 0)
                alerts.push('Connection pool contention');
            if (metrics.queryPerformance.slowQueries > 5)
                alerts.push('Multiple slow queries');
            if (metrics.indexUsage.hitRatio < 90)
                alerts.push('Low index hit ratio');
            if (metrics.cachePerformance.hitRatio < 85)
                alerts.push('Low cache hit ratio');
            let status = 'healthy';
            if (alerts.length > 0) {
                status = alerts.length > 2 ? 'unhealthy' : 'degraded';
            }
            return { status, metrics, alerts };
        }
        catch (error) {
            this.logger.error('Database health check failed:', error);
            return { status: 'unhealthy', alerts: ['Health check failed'] };
        }
    }
};
exports.DatabasePerformanceService = DatabasePerformanceService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_2AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatabasePerformanceService.prototype, "performDailyMaintenance", null);
exports.DatabasePerformanceService = DatabasePerformanceService = DatabasePerformanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        performance_monitor_service_1.PerformanceMonitorService])
], DatabasePerformanceService);
//# sourceMappingURL=database-performance.service.js.map