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
const throttler_1 = require("@nestjs/throttler");
const centers_service_1 = require("./centers.service");
const create_center_dto_1 = require("./dto/create-center.dto");
const update_center_dto_1 = require("./dto/update-center.dto");
const center_response_dto_1 = require("./dto/center-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let CentersController = class CentersController {
    constructor(centersService) {
        this.centersService = centersService;
    }
    async create(createCenterDto) {
        return this.centersService.create(createCenterDto);
    }
    async findAll(page, limit, city, province, type, isActive) {
        return this.centersService.findAll(page, limit, city, province, type, isActive);
    }
    async getStatistics() {
        return this.centersService.getStatistics();
    }
    async findByCode(code) {
        return this.centersService.findByCode(code);
    }
    async findOne(id) {
        return this.centersService.findOne(id);
    }
    async update(id, updateCenterDto) {
        return this.centersService.update(id, updateCenterDto);
    }
    async activate(id) {
        return this.centersService.activate(id);
    }
    async deactivate(id) {
        return this.centersService.deactivate(id);
    }
    async remove(id) {
        return this.centersService.remove(id);
    }
};
exports.CentersController = CentersController;
__decorate([
    (0, common_1.Post)(),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Create new center' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Center successfully created', type: center_response_dto_1.CenterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Center code or email already exists' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, roles_decorator_1.Roles)('admin', 'national_stakeholder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_center_dto_1.CreateCenterDto]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all centers with pagination and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of centers' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 10)' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'Filter by city' }),
    (0, swagger_1.ApiQuery)({ name: 'province', required: false, description: 'Filter by province' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, description: 'Filter by center type' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Filter by active status' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('province')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('isActive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('statistics'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get centers statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Centers statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get center by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'Center code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center found', type: center_response_dto_1.CenterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Get center by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center found', type: center_response_dto_1.CenterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Update center information' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center successfully updated', type: center_response_dto_1.CenterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Center code or email already exists' }),
    (0, roles_decorator_1.Roles)('admin', 'national_stakeholder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_center_dto_1.UpdateCenterDto]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center successfully activated', type: center_response_dto_1.CenterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, roles_decorator_1.Roles)('admin', 'national_stakeholder'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Center successfully deactivated', type: center_response_dto_1.CenterResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, roles_decorator_1.Roles)('admin', 'national_stakeholder'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a center' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Center ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Center successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Center not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete center with active users' }),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CentersController.prototype, "remove", null);
exports.CentersController = CentersController = __decorate([
    (0, swagger_1.ApiTags)('centers'),
    (0, common_1.Controller)('centers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [centers_service_1.CentersService])
], CentersController);
//# sourceMappingURL=centers.controller.js.map