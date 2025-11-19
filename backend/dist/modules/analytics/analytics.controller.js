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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const enhanced_throttler_guard_1 = require("../auth/guards/enhanced-throttler.guard");
const analytics_service_1 = require("./analytics.service");
const enhanced_analytics_dto_1 = require("./dto/enhanced-analytics.dto");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboard(query) {
        return await this.analyticsService.getDashboardData(query.centerId, query.timeRange);
    }
    async getCancerStats(provinceId, cancerType) {
        return await this.analyticsService.getCancerStatistics(provinceId, cancerType);
    }
    async getTrends(period) {
        return await this.analyticsService.getCancerTrends(period);
    }
    async getCenterPerformance() {
        return await this.analyticsService.getCenterPerformance();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get analytics dashboard data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'centerId', required: false, description: 'Filter by center ID' }),
    (0, swagger_1.ApiQuery)({ name: 'timeRange', required: false, description: 'Time range (7d, 30d, 90d, 1y)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [enhanced_analytics_dto_1.ExecutiveDashboardQueryDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('cancer-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cancer statistics retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'provinceId', required: false, description: 'Filter by province' }),
    (0, swagger_1.ApiQuery)({ name: 'cancerType', required: false, description: 'Filter by cancer type' }),
    __param(0, (0, common_1.Query)('provinceId')),
    __param(1, (0, common_1.Query)('cancerType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCancerStats", null);
__decorate([
    (0, common_1.Get)('trends'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cancer trends over time' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trend data retrieved successfully' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: false, description: 'Time period (monthly, quarterly, yearly)' }),
    __param(0, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Get)('center-performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get center performance metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center performance data retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getCenterPerformance", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, enhanced_throttler_guard_1.EnhancedThrottlerGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map