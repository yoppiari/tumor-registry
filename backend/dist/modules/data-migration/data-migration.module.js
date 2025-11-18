"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMigrationModule = void 0;
const common_1 = require("@nestjs/common");
const data_migration_controller_1 = require("./data-migration.controller");
const data_migration_service_1 = require("./data-migration.service");
const database_module_1 = require("../../database/database.module");
const auth_module_1 = require("../auth/auth.module");
let DataMigrationModule = class DataMigrationModule {
};
exports.DataMigrationModule = DataMigrationModule;
exports.DataMigrationModule = DataMigrationModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, auth_module_1.AuthModule],
        controllers: [data_migration_controller_1.DataMigrationController],
        providers: [data_migration_service_1.DataMigrationService],
        exports: [data_migration_service_1.DataMigrationService],
    })
], DataMigrationModule);
//# sourceMappingURL=data-migration.module.js.map