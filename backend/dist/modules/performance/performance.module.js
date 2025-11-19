"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceModule = void 0;
const common_1 = require("@nestjs/common");
const performance_controller_1 = require("./performance.controller");
const performance_service_1 = require("./performance.service");
const redis_service_1 = require("./redis.service");
const performance_monitor_service_1 = require("./performance-monitor.service");
const streaming_service_1 = require("./streaming.service");
const database_performance_service_1 = require("./database-performance.service");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
let PerformanceModule = class PerformanceModule {
};
exports.PerformanceModule = PerformanceModule;
exports.PerformanceModule = PerformanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            config_1.ConfigModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [performance_controller_1.PerformanceController],
        providers: [
            performance_service_1.PerformanceService,
            redis_service_1.RedisService,
            performance_monitor_service_1.PerformanceMonitorService,
            streaming_service_1.StreamingService,
            database_performance_service_1.DatabasePerformanceService,
        ],
        exports: [
            performance_service_1.PerformanceService,
            redis_service_1.RedisService,
            performance_monitor_service_1.PerformanceMonitorService,
            streaming_service_1.StreamingService,
            database_performance_service_1.DatabasePerformanceService,
        ],
    })
], PerformanceModule);
//# sourceMappingURL=performance.module.js.map