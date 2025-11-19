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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApprovalDto = exports.CreateApprovalDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateApprovalDto {
}
exports.CreateApprovalDto = CreateApprovalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Research request ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateApprovalDto.prototype, "researchRequestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ApprovalLevel, description: 'Approval level' }),
    (0, class_validator_1.IsEnum)(client_1.ApprovalLevel),
    __metadata("design:type", typeof (_a = typeof client_1.ApprovalLevel !== "undefined" && client_1.ApprovalLevel) === "function" ? _a : Object)
], CreateApprovalDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ApprovalStatus, description: 'Approval status' }),
    (0, class_validator_1.IsEnum)(client_1.ApprovalStatus),
    __metadata("design:type", typeof (_b = typeof client_1.ApprovalStatus !== "undefined" && client_1.ApprovalStatus) === "function" ? _b : Object)
], CreateApprovalDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval comments' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApprovalDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval conditions (JSON format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApprovalDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether this is the final approval' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateApprovalDto.prototype, "isFinal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether delegation is allowed' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateApprovalDto.prototype, "delegationAllowed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Delegated to user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateApprovalDto.prototype, "delegatedToId", void 0);
class UpdateApprovalDto {
}
exports.UpdateApprovalDto = UpdateApprovalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.ApprovalStatus, description: 'Approval status' }),
    (0, class_validator_1.IsEnum)(client_1.ApprovalStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", typeof (_c = typeof client_1.ApprovalStatus !== "undefined" && client_1.ApprovalStatus) === "function" ? _c : Object)
], UpdateApprovalDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval comments' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApprovalDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Approval conditions (JSON format)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApprovalDto.prototype, "conditions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether this is the final approval' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateApprovalDto.prototype, "isFinal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether delegation is allowed' }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateApprovalDto.prototype, "delegationAllowed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Delegated to user ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateApprovalDto.prototype, "delegatedToId", void 0);
//# sourceMappingURL=create-approval.dto.js.map