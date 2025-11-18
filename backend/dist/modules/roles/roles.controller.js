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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const permissions_guard_1 = require("@/auth/guards/permissions.guard");
const permissions_decorator_1 = require("@/auth/decorators/permissions.decorator");
const audit_log_decorator_1 = require("@/common/decorators/audit-log.decorator");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async findAll(includePermissions) {
        const include = includePermissions === 'true';
        return await this.rolesService.findAll(include);
    }
    async getHierarchy() {
        return await this.rolesService.getRoleHierarchy();
    }
    async getAllPermissions() {
        return await this.rolesService.getAllPermissions();
    }
    async findById(id, includePermissions) {
        const include = includePermissions === 'true';
        return await this.rolesService.findById(id, include);
    }
    async getRolePermissions(id) {
        return await this.rolesService.getRolePermissions(id);
    }
    async create(createRoleDto) {
        return await this.rolesService.create(createRoleDto);
    }
    async update(id, updateRoleDto) {
        return await this.rolesService.update(id, updateRoleDto);
    }
    async updateRolePermissions(id, updatePermissionsDto) {
        await this.rolesService.updateRolePermissions(id, updatePermissionsDto.permissionCodes);
        return { message: 'Role permissions updated successfully' };
    }
    async delete(id) {
        await this.rolesService.delete(id);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_READ'),
    (0, swagger_1.ApiQuery)({ name: 'includePermissions', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('includePermissions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hierarchy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role hierarchy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role hierarchy retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getHierarchy", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permissions grouped by resource' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('PERMISSIONS_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_READ'),
    (0, swagger_1.ApiQuery)({ name: 'includePermissions', required: false, type: Boolean }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('includePermissions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role permissions' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role permissions retrieved successfully' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_READ'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRolePermissions", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create new role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Role already exists' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_CREATE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, audit_log_decorator_1.AuditLog)('CREATE_ROLE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cannot modify system roles' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_ROLE'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role permissions' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role permissions updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_UPDATE'),
    (0, audit_log_decorator_1.AuditLog)('UPDATE_ROLE_PERMISSIONS'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updateRolePermissions", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete role' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Role ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Role deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Role not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Cannot delete system roles or roles with active users' }),
    (0, permissions_decorator_1.RequirePermissions)('ROLES_DELETE'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, audit_log_decorator_1.AuditLog)('DELETE_ROLE'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "delete", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, common_1.Controller)('roles'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map