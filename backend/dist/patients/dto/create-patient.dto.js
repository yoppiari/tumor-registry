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
exports.CreatePatientDto = exports.MolecularMarkerDto = exports.TNMClassificationDto = exports.CancerDiagnosisDto = exports.EmergencyContactDto = exports.AddressDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class AddressDto {
}
exports.AddressDto = AddressDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Street address' }),
    __metadata("design:type", String)
], AddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Village/Kelurahan' }),
    __metadata("design:type", String)
], AddressDto.prototype, "village", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'District/Kecamatan' }),
    __metadata("design:type", String)
], AddressDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'City/Kabupaten' }),
    __metadata("design:type", String)
], AddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Province' }),
    __metadata("design:type", String)
], AddressDto.prototype, "province", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{5}$/, { message: 'Postal code must be 5 digits' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '5-digit postal code' }),
    __metadata("design:type", String)
], AddressDto.prototype, "postalCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Country (default: Indonesia)' }),
    __metadata("design:type", String)
], AddressDto.prototype, "country", void 0);
class EmergencyContactDto {
}
exports.EmergencyContactDto = EmergencyContactDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_1.ApiProperty)({ description: 'Emergency contact name' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['spouse', 'parent', 'child', 'sibling', 'other', 'friend']),
    (0, swagger_1.ApiProperty)({ enum: ['spouse', 'parent', 'child', 'sibling', 'other', 'friend'], description: 'Relationship to patient' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "relationship", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)('ID'),
    (0, swagger_1.ApiProperty)({ description: 'Emergency contact phone number (Indonesian format)' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Emergency contact address' }),
    __metadata("design:type", String)
], EmergencyContactDto.prototype, "address", void 0);
class CancerDiagnosisDto {
}
exports.CancerDiagnosisDto = CancerDiagnosisDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ description: 'Primary cancer site' }),
    __metadata("design:type", String)
], CancerDiagnosisDto.prototype, "primarySite", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['left', 'right', 'bilateral', 'midline', 'unknown']),
    (0, swagger_1.ApiProperty)({ enum: ['left', 'right', 'bilateral', 'midline', 'unknown'], description: 'Laterality' }),
    __metadata("design:type", String)
], CancerDiagnosisDto.prototype, "laterality", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ description: 'Morphology (ICD-O code)' }),
    __metadata("design:type", String)
], CancerDiagnosisDto.prototype, "morphology", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['benign', 'borderline', 'invasive', 'in_situ']),
    (0, swagger_1.ApiProperty)({ enum: ['benign', 'borderline', 'invasive', 'in_situ'], description: 'Tumor behavior' }),
    __metadata("design:type", String)
], CancerDiagnosisDto.prototype, "behavior", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Grade of differentiation' }),
    __metadata("design:type", String)
], CancerDiagnosisDto.prototype, "grade", void 0);
class TNMClassificationDto {
}
exports.TNMClassificationDto = TNMClassificationDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^T[0-4][a-c]?$/, { message: 'T classification must be valid format (e.g., T1, T2a, T3b)' }),
    (0, swagger_1.ApiProperty)({ description: 'Tumor size/extent (T classification)' }),
    __metadata("design:type", String)
], TNMClassificationDto.prototype, "t", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^N[0-3][a-c]?$/, { message: 'N classification must be valid format (e.g., N0, N1, N2a)' }),
    (0, swagger_1.ApiProperty)({ description: 'Lymph node involvement (N classification)' }),
    __metadata("design:type", String)
], TNMClassificationDto.prototype, "n", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^M[0-1]$/, { message: 'M classification must be M0 or M1' }),
    (0, swagger_1.ApiProperty)({ description: 'Metastasis (M classification)' }),
    __metadata("design:type", String)
], TNMClassificationDto.prototype, "m", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clinical stage' }),
    __metadata("design:type", String)
], TNMClassificationDto.prototype, "clinicalStage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pathological stage' }),
    __metadata("design:type", String)
], TNMClassificationDto.prototype, "pathologicalStage", void 0);
class MolecularMarkerDto {
}
exports.MolecularMarkerDto = MolecularMarkerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, swagger_1.ApiProperty)({ description: 'Marker name (e.g., HER2, ER, PR)' }),
    __metadata("design:type", String)
], MolecularMarkerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['positive', 'negative', 'unknown']),
    (0, swagger_1.ApiProperty)({ enum: ['positive', 'negative', 'unknown'], description: 'Test result' }),
    __metadata("design:type", String)
], MolecularMarkerDto.prototype, "result", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Test date', type: 'string', format: 'date' }),
    __metadata("design:type", Date)
], MolecularMarkerDto.prototype, "testDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Test methodology' }),
    __metadata("design:type", String)
], MolecularMarkerDto.prototype, "methodology", void 0);
class CreatePatientDto {
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9\-\/]+$/, { message: 'Medical record number can only contain letters, numbers, hyphens, and slashes' }),
    (0, swagger_1.ApiProperty)({ description: 'Medical record number (No. RM)', example: 'RM20240001' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "medicalRecordNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{16}$/, { message: 'Identity number must be 16 digits' }),
    (0, swagger_1.ApiPropertyOptional)({ description: '16-digit NIK', example: '3201011234560001' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "identityNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_1.ApiProperty)({ description: 'Patient full name', example: 'John Doe' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiProperty)({ description: 'Date of birth', type: 'string', format: 'date' }),
    __metadata("design:type", Date)
], CreatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['male', 'female']),
    (0, swagger_1.ApiProperty)({ enum: ['male', 'female'], description: 'Gender' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['A', 'B', 'AB', 'O']),
    (0, swagger_1.ApiPropertyOptional)({ enum: ['A', 'B', 'AB', 'O'], description: 'Blood type' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "bloodType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['positive', 'negative']),
    (0, swagger_1.ApiPropertyOptional)({ enum: ['positive', 'negative'], description: 'Rh factor' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "rhFactor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsPhoneNumber)('ID'),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number (Indonesian format)', example: '+62812345678' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Email address', example: 'patient@example.com' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AddressDto),
    (0, swagger_1.ApiProperty)({ type: AddressDto, description: 'Patient address' }),
    __metadata("design:type", AddressDto)
], CreatePatientDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => EmergencyContactDto),
    (0, swagger_1.ApiProperty)({ type: EmergencyContactDto, description: 'Emergency contact information' }),
    __metadata("design:type", EmergencyContactDto)
], CreatePatientDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Occupation', example: 'Teacher' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "occupation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3'],
        description: 'Education level'
    }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "educationLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['single', 'married', 'divorced', 'widowed']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['single', 'married', 'divorced', 'widowed'],
        description: 'Marital status'
    }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'other']),
    (0, swagger_1.ApiPropertyOptional)({
        enum: ['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'other'],
        description: 'Religion'
    }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "religion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CancerDiagnosisDto),
    (0, swagger_1.ApiPropertyOptional)({ type: CancerDiagnosisDto, description: 'Cancer diagnosis information' }),
    __metadata("design:type", CancerDiagnosisDto)
], CreatePatientDto.prototype, "primaryCancerDiagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['I', 'II', 'III', 'IV']),
    (0, swagger_1.ApiPropertyOptional)({ enum: ['I', 'II', 'III', 'IV'], description: 'Cancer stage' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "cancerStage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['G1', 'G2', 'G3', 'G4']),
    (0, swagger_1.ApiPropertyOptional)({ enum: ['G1', 'G2', 'G3', 'G4'], description: 'Cancer grade' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "cancerGrade", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TNMClassificationDto),
    (0, swagger_1.ApiPropertyOptional)({ type: TNMClassificationDto, description: 'TNM classification' }),
    __metadata("design:type", TNMClassificationDto)
], CreatePatientDto.prototype, "tnmClassification", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Histology', example: 'Adenocarcinoma' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "histology", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MolecularMarkerDto),
    (0, swagger_1.ApiPropertyOptional)({ type: [MolecularMarkerDto], description: 'Molecular markers' }),
    __metadata("design:type", Array)
], CreatePatientDto.prototype, "molecularMarkers", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased']),
    (0, swagger_1.ApiProperty)({
        enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'],
        description: 'Treatment status'
    }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "treatmentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of diagnosis', type: 'string', format: 'date' }),
    __metadata("design:type", Date)
], CreatePatientDto.prototype, "dateOfDiagnosis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of first visit', type: 'string', format: 'date' }),
    __metadata("design:type", Date)
], CreatePatientDto.prototype, "dateOfFirstVisit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({ description: 'Treatment center ID' }),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "treatmentCenter", void 0);
//# sourceMappingURL=create-patient.dto.js.map