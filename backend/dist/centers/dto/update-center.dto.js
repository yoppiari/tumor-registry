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
exports.UpdateCenterDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_center_dto_1 = require("./create-center.dto");
class CoordinatesDto {
}
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Latitude harus berupa angka' }),
    (0, class_validator_1.Min)(-90, { message: 'Latitude minimal -90' }),
    (0, class_validator_1.Max)(90, { message: 'Latitude maksimal 90' }),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Longitude harus berupa angka' }),
    (0, class_validator_1.Min)(-180, { message: 'Longitude minimal -180' }),
    (0, class_validator_1.Max)(180, { message: 'Longitude maksimal 180' }),
    __metadata("design:type", Number)
], CoordinatesDto.prototype, "longitude", void 0);
class UpdateCenterDto {
}
exports.UpdateCenterDto = UpdateCenterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Nama harus berupa string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Nama maksimal 255 karakter' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Kode harus berupa string' }),
    (0, class_validator_1.Matches)(/^[A-Z0-9-]{3,20}$/, { message: 'Kode hanya boleh huruf besar, angka, dan dash (3-20 karakter)' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_center_dto_1.CenterType, { message: 'Tipe center tidak valid' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Alamat harus berupa string' }),
    (0, class_validator_1.MaxLength)(500, { message: 'Alamat maksimal 500 karakter' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Kota harus berupa string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Kota maksimal 100 karakter' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Provinsi harus berupa string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Provinsi maksimal 100 karakter' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Kode pos harus berupa string' }),
    (0, class_validator_1.Matches)(/^\d{5}$/, { message: 'Kode pos harus 5 digit angka' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Telepon harus berupa string' }),
    (0, class_validator_1.Matches)(/^(\+62|62)?[0-9]+$/, { message: 'Format telepon tidak valid' }),
    (0, class_validator_1.MaxLength)(20, { message: 'Telepon maksimal 20 karakter' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Email tidak valid' }),
    __metadata("design:type", String)
], UpdateCenterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Kapasitas harus berupa angka' }),
    (0, class_validator_1.Min)(1, { message: 'Kapasitas minimal 1' }),
    __metadata("design:type", Number)
], UpdateCenterDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)({ message: 'Koordinat harus berupa object' }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CoordinatesDto),
    __metadata("design:type", CoordinatesDto)
], UpdateCenterDto.prototype, "coordinates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Spesialisasi harus berupa array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Setiap spesialisasi harus berupa string' }),
    __metadata("design:type", Array)
], UpdateCenterDto.prototype, "specialties", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Layanan harus berupa array' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Setiap layanan harus berupa string' }),
    __metadata("design:type", Array)
], UpdateCenterDto.prototype, "services", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Status aktif harus berupa boolean' }),
    __metadata("design:type", Boolean)
], UpdateCenterDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-center.dto.js.map