"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemAdministrationModule = void 0;
const common_1 = require("@nestjs/common");
const system_administration_controller_1 = require("./controllers/system-administration.controller");
const system_administration_service_1 = require("./services/system-administration.service");
const configuration_service_1 = require("./services/configuration.service");
const dashboard_service_1 = require("./services/dashboard.service");
const prisma_service_1 = require("../../database/prisma.service");
let SystemAdministrationModule = class SystemAdministrationModule {
};
exports.SystemAdministrationModule = SystemAdministrationModule;
exports.SystemAdministrationModule = SystemAdministrationModule = __decorate([
    (0, common_1.Module)({
        controllers: [system_administration_controller_1.SystemAdministrationController],
        providers: [
            system_administration_service_1.SystemAdministrationService,
            configuration_service_1.ConfigurationService,
            dashboard_service_1.DashboardService,
            prisma_service_1.PrismaService,
        ],
        exports: [
            system_administration_service_1.SystemAdministrationService,
            configuration_service_1.ConfigurationService,
            dashboard_service_1.DashboardService,
        ],
    })
], SystemAdministrationModule);
//# sourceMappingURL=system-administration.module.js.map