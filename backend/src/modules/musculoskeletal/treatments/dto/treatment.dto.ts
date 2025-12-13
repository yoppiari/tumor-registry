import { IsString, IsInt, IsDateString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TREATMENT_TYPES = ['Surgery', 'Chemotherapy', 'Radiotherapy', 'Targeted Therapy', 'Immunotherapy'];
const SURGERY_TYPES = ['Limb Salvage', 'Amputation', 'Wide Excision', 'Curettage', 'Biopsy'];
const SURGICAL_MARGINS = ['Wide', 'Marginal', 'Intralesional', 'Contaminated'];
const TREATMENT_STATUS = ['Planned', 'Ongoing', 'Completed', 'Discontinued'];
const RESPONSE_TYPES = ['Complete', 'Partial', 'Stable', 'Progressive'];
const HUVOS_GRADES = ['I', 'II', 'III', 'IV'];

export class TreatmentManagementDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty({ enum: TREATMENT_TYPES })
  treatmentType: string;

  // Surgery fields
  @ApiPropertyOptional({ enum: SURGERY_TYPES })
  surgeryType?: string;

  @ApiPropertyOptional()
  reconstructionMethod?: string;

  @ApiPropertyOptional({ enum: SURGICAL_MARGINS })
  surgicalMargin?: string;

  @ApiPropertyOptional()
  marginDistance?: number;

  @ApiPropertyOptional()
  amputationLevel?: string;

  // Chemotherapy fields
  @ApiPropertyOptional()
  chemotherapyProtocol?: string;

  @ApiPropertyOptional()
  numberOfCycles?: number;

  @ApiPropertyOptional()
  cyclesCompleted?: number;

  // Radiotherapy fields
  @ApiPropertyOptional()
  radiotherapyDose?: number;

  @ApiPropertyOptional()
  numberOfFractions?: number;

  @ApiPropertyOptional()
  fractionsCompleted?: number;

  // Common fields
  @ApiPropertyOptional()
  startDate?: Date;

  @ApiPropertyOptional()
  endDate?: Date;

  @ApiProperty({ enum: TREATMENT_STATUS })
  status: string;

  @ApiPropertyOptional({ enum: RESPONSE_TYPES })
  response?: string;

  @ApiPropertyOptional({ enum: HUVOS_GRADES })
  huvosGrade?: string;

  @ApiPropertyOptional()
  complications?: string;

  @ApiPropertyOptional()
  adverseEvents?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  performedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateTreatmentDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty({ enum: TREATMENT_TYPES, example: 'Surgery' })
  @IsString()
  @IsIn(TREATMENT_TYPES)
  treatmentType: string;

  // Surgery fields
  @ApiPropertyOptional({ enum: SURGERY_TYPES, example: 'Limb Salvage' })
  @IsOptional()
  @IsString()
  @IsIn(SURGERY_TYPES)
  surgeryType?: string;

  @ApiPropertyOptional({ example: 'Endoprosthesis' })
  @IsOptional()
  @IsString()
  reconstructionMethod?: string;

  @ApiPropertyOptional({ enum: SURGICAL_MARGINS, example: 'Wide' })
  @IsOptional()
  @IsString()
  @IsIn(SURGICAL_MARGINS)
  surgicalMargin?: string;

  @ApiPropertyOptional({ example: 5, description: 'Margin distance in mm' })
  @IsOptional()
  @IsNumber()
  marginDistance?: number;

  @ApiPropertyOptional({ example: 'Below-knee' })
  @IsOptional()
  @IsString()
  amputationLevel?: string;

  // Chemotherapy fields
  @ApiPropertyOptional({ example: 'MAP (Methotrexate, Adriamycin, Cisplatin)' })
  @IsOptional()
  @IsString()
  chemotherapyProtocol?: string;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsInt()
  numberOfCycles?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  cyclesCompleted?: number;

  // Radiotherapy fields
  @ApiPropertyOptional({ example: 50, description: 'Total dose in Gy' })
  @IsOptional()
  @IsNumber()
  radiotherapyDose?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  numberOfFractions?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  fractionsCompleted?: number;

  // Common fields
  @ApiPropertyOptional({ example: '2025-12-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-01' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: TREATMENT_STATUS, default: 'Planned' })
  @IsOptional()
  @IsString()
  @IsIn(TREATMENT_STATUS)
  status?: string;

  @ApiPropertyOptional({ enum: RESPONSE_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(RESPONSE_TYPES)
  response?: string;

  @ApiPropertyOptional({ enum: HUVOS_GRADES, description: 'Chemotherapy response grading for osteosarcoma' })
  @IsOptional()
  @IsString()
  @IsIn(HUVOS_GRADES)
  huvosGrade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complications?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adverseEvents?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  performedBy?: string;
}

export class UpdateTreatmentDto {
  @ApiPropertyOptional({ enum: SURGERY_TYPES })
  @IsOptional()
  @IsString()
  surgeryType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reconstructionMethod?: string;

  @ApiPropertyOptional({ enum: SURGICAL_MARGINS })
  @IsOptional()
  @IsString()
  surgicalMargin?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  marginDistance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  amputationLevel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  chemotherapyProtocol?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  numberOfCycles?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  cyclesCompleted?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  radiotherapyDose?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  numberOfFractions?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  fractionsCompleted?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: TREATMENT_STATUS })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ enum: RESPONSE_TYPES })
  @IsOptional()
  @IsString()
  response?: string;

  @ApiPropertyOptional({ enum: HUVOS_GRADES })
  @IsOptional()
  @IsString()
  huvosGrade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complications?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  adverseEvents?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  performedBy?: string;
}
