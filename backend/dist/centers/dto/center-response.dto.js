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
exports.CenterResponseDto = exports.CoordinatesResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CoordinatesResponseDto {
}
exports.CoordinatesResponseDto = CoordinatesResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Latitude coordinate',
        example: -6.1809,
    }),
    __metadata("design:type", Number)
], CoordinatesResponseDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Longitude coordinate',
        example: 106.7957,
    }),
    __metadata("design:type", Number)
], CoordinatesResponseDto.prototype, "longitude", void 0);
class CenterResponseDto {
}
exports.CenterResponseDto = CenterResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Center ID',
        example: 'center-001',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Center name',
        example: 'Rumah Sakit Kanker Dharmais',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Center code',
        example: 'RSCM-DH',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Center type',
        enum: ['hospital', 'clinic', 'laboratory', 'research_center'],
        example: 'hospital',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Center address',
        example: 'Jl. Letjen S. Parman Kav. 84-86',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City',
        example: 'Jakarta Barat',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Province',
        example: 'DKI Jakarta',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Postal code',
        example: '11420',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '+62215680800',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'info@dharmaishospital.co.id',
    }),
    __metadata("design:type", String)
], CenterResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Center capacity',
        example: 200,
    }),
    __metadata("design:type", Number)
], CenterResponseDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active status',
        example: true,
    }),
    __metadata("design:type", Boolean)
], CenterResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Geographic coordinates',
        type: CoordinatesResponseDto,
        required: false,
    }),
    __metadata("design:type", CoordinatesResponseDto)
], CenterResponseDto.prototype, "coordinates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Medical specialties',
        example: ['Onkologi', 'Radioterapi', 'Kemoterapi'],
        isArray: true,
    }),
    __metadata("design:type", Array)
], CenterResponseDto.prototype, "specialties", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Available services',
        example: ['Diagnosis', 'Pengobatan', 'Rehabilitasi'],
        isArray: true,
    }),
    __metadata("design:type", Array)
], CenterResponseDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CenterResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], CenterResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=center-response.dto.js.map