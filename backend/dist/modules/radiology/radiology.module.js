"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiologyModule = void 0;
const common_1 = require("@nestjs/common");
const radiology_controller_1 = require("./radiology.controller");
const radiology_service_1 = require("./radiology.service");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
let RadiologyModule = class RadiologyModule {
};
exports.RadiologyModule = RadiologyModule;
exports.RadiologyModule = RadiologyModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [radiology_controller_1.RadiologyController],
        providers: [radiology_service_1.RadiologyService],
        exports: [radiology_service_1.RadiologyService],
    })
], RadiologyModule);
//# sourceMappingURL=radiology.module.js.map