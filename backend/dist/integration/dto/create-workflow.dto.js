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
exports.CreateWorkflowDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateWorkflowDto {
}
exports.CreateWorkflowDto = CreateWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow name',
        example: 'ADT to FHIR Patient Conversion'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow description',
        example: 'Converts HL7 ADT messages to FHIR Patient resources'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow type',
        enum: ['inbound', 'outbound', 'bi_directional'],
        example: 'inbound'
    }),
    (0, class_validator_1.IsEnum)(['inbound', 'outbound', 'bi_directional']),
    __metadata("design:type", String)
], CreateWorkflowDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow trigger configuration',
        example: {
            type: 'event',
            condition: 'message.type == "ADT"'
        }
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "trigger", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workflow steps',
        type: Array,
        example: [
            {
                id: 'step-1',
                name: 'Receive HL7 Message',
                type: 'receive',
                order: 1,
                configuration: { protocol: 'tcp', port: 2575 }
            }
        ]
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateWorkflowDto.prototype, "steps", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Workflow configuration',
        example: {
            parallel: false,
            transactional: true,
            rollbackOnFailure: true,
            logging: { enabled: true, level: 'info', detailed: true },
            monitoring: { enabled: true, alerts: true, metrics: true }
        }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWorkflowDto.prototype, "configuration", void 0);
//# sourceMappingURL=create-workflow.dto.js.map