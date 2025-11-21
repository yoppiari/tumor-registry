"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const bull_1 = require("@nestjs/bull");
const core_1 = require("@nestjs/core");
const common_2 = require("@nestjs/common");
const database_module_1 = require("./database/database.module");
const common_module_1 = require("./common/common.module");
const health_module_1 = require("./common/health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const centers_module_1 = require("./modules/centers/centers.module");
const patients_module_1 = require("./modules/patients/patients.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const research_module_1 = require("./modules/research/research.module");
const research_impact_module_1 = require("./modules/research-impact/research-impact.module");
const reports_module_1 = require("./modules/reports/reports.module");
const scheduled_reports_module_1 = require("./modules/scheduled-reports/scheduled-reports.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const medical_imaging_module_1 = require("./modules/medical-imaging/medical-imaging.module");
const case_review_module_1 = require("./modules/case-review/case-review.module");
const peer_review_module_1 = require("./modules/peer-review/peer-review.module");
const offline_queue_module_1 = require("./modules/offline-queue/offline-queue.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
let AppModule = class AppModule {
    configure(consumer) {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            bull_1.BullModule.forRoot({
                redis: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                },
            }),
            database_module_1.DatabaseModule,
            common_module_1.CommonModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            centers_module_1.CentersModule,
            patients_module_1.PatientsModule,
            analytics_module_1.AnalyticsModule,
            research_module_1.ResearchModule,
            research_impact_module_1.ResearchImpactModule,
            reports_module_1.ReportsModule,
            scheduled_reports_module_1.ScheduledReportsModule,
            notifications_module_1.NotificationsModule,
            medical_imaging_module_1.MedicalImagingModule,
            case_review_module_1.CaseReviewModule,
            peer_review_module_1.PeerReviewModule,
            offline_queue_module_1.OfflineQueueModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: http_exception_filter_1.ValidationExceptionFilter,
            },
            {
                provide: core_1.APP_PIPE,
                useValue: new common_2.ValidationPipe({
                    whitelist: true,
                    forbidNonWhitelisted: true,
                    transform: true,
                    transformOptions: {
                        enableImplicitConversion: true,
                    },
                }),
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map