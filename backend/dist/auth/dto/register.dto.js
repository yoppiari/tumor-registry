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
exports.RegisterDto = exports.UserRole = void 0;
const class_validator_1 = require("class-validator");
var UserRole;
(function (UserRole) {
    UserRole["DATA_ENTRY"] = "data_entry";
    UserRole["RESEARCHER"] = "researcher";
    UserRole["ADMIN"] = "admin";
    UserRole["NATIONAL_STAKEHOLDER"] = "national_stakeholder";
})(UserRole || (exports.UserRole = UserRole = {}));
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email harus valid' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email tidak boleh kosong' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password tidak boleh kosong' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password minimal 6 karakter' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama tidak boleh kosong' }),
    (0, class_validator_1.IsString)({ message: 'Nama harus berupa string' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(UserRole, { message: 'Role harus salah satu dari: data_entry, researcher, admin, national_stakeholder' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role tidak boleh kosong' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Nomor telepon harus berupa string' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Center ID harus berupa string' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "centerId", void 0);
//# sourceMappingURL=register.dto.js.map