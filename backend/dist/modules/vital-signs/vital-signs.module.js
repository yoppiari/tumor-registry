"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalSignsModule = void 0;
const common_1 = require("@nestjs/common");
const vital_signs_controller_1 = require("./vital-signs.controller");
const vital_signs_service_1 = require("./vital-signs.service");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
let VitalSignsModule = class VitalSignsModule {
};
exports.VitalSignsModule = VitalSignsModule;
exports.VitalSignsModule = VitalSignsModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [vital_signs_controller_1.VitalSignsController],
        providers: [vital_signs_service_1.VitalSignsService],
        exports: [vital_signs_service_1.VitalSignsService],
    })
], VitalSignsModule);
//# sourceMappingURL=vital-signs.module.js.map