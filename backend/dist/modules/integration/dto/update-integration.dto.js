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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIntegrationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateIntegrationDto {
}
exports.UpdateIntegrationDto = UpdateIntegrationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Integration name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIntegrationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Integration description', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateIntegrationDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Configuration settings', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateIntegrationDto.prototype, "config", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Enabled status', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateIntegrationDto.prototype, "enabled", void 0);
//# sourceMappingURL=update-integration.dto.js.map