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
exports.CreateConfigDto = exports.Environment = void 0;
const class_validator_1 = require("class-validator");
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "development";
    Environment["STAGING"] = "staging";
    Environment["PRODUCTION"] = "production";
})(Environment || (exports.Environment = Environment = {}));
class CreateConfigDto {
}
exports.CreateConfigDto = CreateConfigDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigDto.prototype, "key", void 0);
__decorate([
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateConfigDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigDto.prototype, "isEncrypted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigDto.prototype, "isRequired", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateConfigDto.prototype, "defaultValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsJSON)(),
    __metadata("design:type", Object)
], CreateConfigDto.prototype, "validationRules", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Environment),
    __metadata("design:type", String)
], CreateConfigDto.prototype, "environment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateConfigDto.prototype, "centerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateConfigDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-config.dto.js.map