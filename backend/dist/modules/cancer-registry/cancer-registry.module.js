"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancerRegistryModule = void 0;
const common_1 = require("@nestjs/common");
const cancer_registry_controller_1 = require("./cancer-registry.controller");
const cancer_registry_service_1 = require("./cancer-registry.service");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
let CancerRegistryModule = class CancerRegistryModule {
};
exports.CancerRegistryModule = CancerRegistryModule;
exports.CancerRegistryModule = CancerRegistryModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [cancer_registry_controller_1.CancerRegistryController],
        providers: [cancer_registry_service_1.CancerRegistryService],
        exports: [cancer_registry_service_1.CancerRegistryService],
    })
], CancerRegistryModule);
//# sourceMappingURL=cancer-registry.module.js.map