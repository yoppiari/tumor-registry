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
exports.UpdateProfileDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Nama harus berupa string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Nama maksimal 255 karakter' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Telepon harus berupa string' }),
    (0, class_validator_1.Matches)(/^(\+62|62)?[0-9]+$/, { message: 'Format telepon tidak valid' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Telepon maksimal 20 karakter' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Avatar harus berupa string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'URL avatar maksimal 500 karakter' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatar", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Department harus berupa string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Department maksimal 100 karakter' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "department", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Nomor lisensi harus berupa string' }),
    (0, class_validator_1.MaxLength)(50, { message: 'Nomor lisensi maksimal 50 karakter' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "licenseNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Spesialisasi harus berupa array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Setiap spesialisasi harus berupa string' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Minimal harus ada 1 spesialisasi' }),
    (0, class_validator_1.MaxLength)(10, { each: true, message: 'Setiap spesialisasi maksimal 10 karakter' }),
    __metadata("design:type", Array)
], UpdateProfileDto.prototype, "specialization", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Bio harus berupa string' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Bio maksimal 1000 karakter' }),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "bio", void 0);
//# sourceMappingURL=update-profile.dto.js.map