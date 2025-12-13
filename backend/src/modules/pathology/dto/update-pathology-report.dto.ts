import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsDateString, IsBoolean, IsArray } from 'class-validator';
import { PathologyStatus, TumorGrade } from './create-pathology-report.dto';

export class UpdatePathologyReportDto {
  @ApiPropertyOptional({ description: 'Gross description of the specimen' })
  @IsOptional()
  @IsString()
  grossDescription?: string;

  @ApiPropertyOptional({ description: 'Microscopic examination findings' })
  @IsOptional()
  @IsString()
  microscopicDescription?: string;

  @ApiPropertyOptional({ description: 'Final diagnosis' })
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ enum: TumorGrade, description: 'Tumor histological grade' })
  @IsOptional()
  @IsEnum(TumorGrade)
  tumorGrade?: TumorGrade;

  @ApiPropertyOptional({ description: 'Mitosis count per 10 HPF' })
  @IsOptional()
  @IsString()
  mitosisCount?: string;

  @ApiPropertyOptional({ description: 'Percentage of necrosis' })
  @IsOptional()
  @IsString()
  necrosisPercentage?: string;

  @ApiPropertyOptional({ description: 'Tumor cellularity percentage' })
  @IsOptional()
  @IsString()
  cellularity?: string;

  @ApiPropertyOptional({ description: 'Immunohistochemistry findings' })
  @IsOptional()
  @IsString()
  immunohistochemistry?: string;

  @ApiPropertyOptional({ description: 'Molecular/genetic testing results' })
  @IsOptional()
  @IsString()
  molecularFindings?: string;

  @ApiPropertyOptional({ description: 'Margins status' })
  @IsOptional()
  @IsString()
  marginsStatus?: string;

  @ApiPropertyOptional({ description: 'Is malignant?' })
  @IsOptional()
  @IsBoolean()
  isMalignant?: boolean;

  @ApiPropertyOptional({ enum: PathologyStatus, description: 'Status of the pathology report' })
  @IsOptional()
  @IsEnum(PathologyStatus)
  status?: PathologyStatus;

  @ApiPropertyOptional({ description: 'Additional comments or notes' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'Date when report was finalized' })
  @IsOptional()
  @IsDateString()
  reportDate?: string;

  @ApiPropertyOptional({ description: 'Special stains used', type: [String] })
  @IsOptional()
  @IsArray()
  specialStains?: string[];

  @ApiPropertyOptional({ description: 'IHC markers used', type: [String] })
  @IsOptional()
  @IsArray()
  ihcMarkers?: string[];
}
