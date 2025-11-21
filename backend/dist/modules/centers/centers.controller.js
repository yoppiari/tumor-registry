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
exports.CentersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const centers_service_1 = require("./centers.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("../../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("../../common/decorators/audit-log.decorator");
let CentersController = class CentersController {
    constructor(centersService) {
        this.centersService = centersService;
    }
    async findAll(includeInactive) {
        const include = includeInactive === 'true';
        return await this.centersService.findAll(include);
    }
    async getStatistics() {
        return await this.centersService.getStatistics();
    }
    async findById(id, includeUsers) {
        const include = includeUsers === 'true';
        return await this.centersService.findById(id, include);
    }
    async getCenterUsers(id) {
        return await this.centersService.getCenterUsers(id);
    }
    async create(createCenterDto) {
        return await this.centersService.create(createCenterDto);
    }
    async update(id, updateCenterDto) {
        return await this.centersService.update(id, updateCenterDto);
    }
    async activate(id) {
        return await this.centersService.activate(id);
    }
    async deactivate(id) {
        return await this.centersService.deactivate(id);
    }
    async delete(id) {
        await this.centersService.delete(id);
    }
};
exports.CentersController = CentersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all centers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Centers retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get center statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center statistics retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get center by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_READ'),
    (0, swagger_1.ApiQuery)({ name: 'includeUsers', required: false, type: Boolean }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includeUsers')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get center users' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center users retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('USERS_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "getCenterUsers", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new center' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Center created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Center already exists' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_CENTER'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cannot modify default center' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_CENTER'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center activated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('ACTIVATE_CENTER'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "activate", null);
__decorate([
    (0, common_1.Put)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cannot deactivate default center' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('DEACTIVATE_CENTER'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Center deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Cannot delete default center or centers with active users' }),
    (0, permissions_decorator_1.RequirePermissions)('CENTERS_DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, audit_log_decorator_1.AuditLog)('DELETE_CENTER'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "delete", null);
exports.CentersController = CentersController = __decorate([
    (0, swagger_1.ApiTags)('Centers'),
    (0, common_1.Controller)('centers'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [centers_service_1.CentersService])
], CentersController);
//# sourceMappingURL=centers.controller.js.map