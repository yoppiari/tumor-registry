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
const health_module_1 = require("./common/health/health.module");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const centers_module_1 = require("./centers/centers.module");
const patients_module_1 = require("./patients/patients.module");
const medical_records_module_1 = require("./medical-records/medical-records.module");
const consent_module_1 = require("./consent/consent.module");
const diagnosis_module_1 = require("./diagnosis/diagnosis.module");
const treatments_module_1 = require("./treatments/treatments.module");
const vital_signs_module_1 = require("./vital-signs/vital-signs.module");
const laboratory_module_1 = require("./laboratory/laboratory.module");
const radiology_module_1 = require("./radiology/radiology.module");
const cancer_registry_module_1 = require("./cancer-registry/cancer-registry.module");
const research_module_1 = require("./research/research.module");
const population_health_module_1 = require("./population-health/population-health.module");
const predictive_analytics_module_1 = require("./predictive-analytics/predictive-analytics.module");
const analytics_module_1 = require("./analytics/analytics.module");
const integration_module_1 = require("./integration/integration.module");
const data_migration_module_1 = require("./data-migration/data-migration.module");
const monitoring_module_1 = require("./monitoring/monitoring.module");
const performance_module_1 = require("./performance/performance.module");
const configuration_1 = require("./config/configuration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            database_module_1.DatabaseModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            centers_module_1.CentersModule,
            patients_module_1.PatientsModule,
            medical_records_module_1.MedicalRecordsModule,
            consent_module_1.ConsentModule,
            diagnosis_module_1.DiagnosisModule,
            treatments_module_1.TreatmentsModule,
            vital_signs_module_1.VitalSignsModule,
            laboratory_module_1.LaboratoryModule,
            radiology_module_1.RadiologyModule,
            cancer_registry_module_1.CancerRegistryModule,
            research_module_1.ResearchModule,
            population_health_module_1.PopulationHealthModule,
            predictive_analytics_module_1.PredictiveAnalyticsModule,
            analytics_module_1.AnalyticsModule,
            integration_module_1.IntegrationModule,
            data_migration_module_1.DataMigrationModule,
            monitoring_module_1.MonitoringModule,
            performance_module_1.PerformanceModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map