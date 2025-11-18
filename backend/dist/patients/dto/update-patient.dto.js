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
exports.UpdatePatientDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_patient_dto_1 = require("./create-patient.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_2 = require("@nestjs/swagger");
class UpdatePatientDto extends (0, swagger_1.PartialType)(create_patient_dto_1.CreatePatientDto) {
}
exports.UpdatePatientDto = UpdatePatientDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_2.ApiPropertyOptional)({ description: 'Patient full name' }),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased']),
    (0, swagger_2.ApiPropertyOptional)({
        enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'],
        description: 'Treatment status'
    }),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "treatmentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, swagger_2.ApiPropertyOptional)({ description: 'Patient deceased status' }),
    __metadata("design:type", Boolean)
], UpdatePatientDto.prototype, "isDeceased", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_2.ApiPropertyOptional)({ description: 'Date of death', type: 'string', format: 'date' }),
    __metadata("design:type", Date)
], UpdatePatientDto.prototype, "dateOfDeath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, swagger_2.ApiPropertyOptional)({ description: 'Cause of death' }),
    __metadata("design:type", String)
], UpdatePatientDto.prototype, "causeOfDeath", void 0);
//# sourceMappingURL=update-patient.dto.js.map