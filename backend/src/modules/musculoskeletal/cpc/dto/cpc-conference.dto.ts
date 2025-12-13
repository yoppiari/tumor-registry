import { IsString, IsDateString, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const RECOMMENDATION_TYPES = ['Surgery', 'Chemotherapy', 'Radiotherapy', 'Combination', 'Palliative', 'Watch and Wait'];

export class CpcConferenceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  conferenceDate: Date;

  @ApiProperty()
  attendees: string;

  @ApiPropertyOptional()
  presentation?: string;

  @ApiProperty()
  recommendation: string;

  @ApiProperty({ enum: RECOMMENDATION_TYPES })
  recommendationType: string;

  @ApiPropertyOptional()
  rationale?: string;

  @ApiPropertyOptional()
  alternativeOptions?: string;

  @ApiProperty({ default: true })
  consensus: boolean;

  @ApiPropertyOptional()
  dissent?: string;

  @ApiProperty()
  documentedBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateCpcConferenceDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty({ example: '2025-12-15' })
  @IsDateString()
  conferenceDate: string;

  @ApiProperty({ example: '["Dr. Smith (Oncologist)", "Dr. Johnson (Surgeon)", "Dr. Lee (Radiologist)"]' })
  @IsString()
  attendees: string;

  @ApiPropertyOptional({ example: 'Patient presents with proximal femur osteosarcoma, 8cm mass with cortical destruction' })
  @IsOptional()
  @IsString()
  presentation?: string;

  @ApiProperty({ example: 'Neoadjuvant chemotherapy followed by limb salvage surgery' })
  @IsString()
  recommendation: string;

  @ApiProperty({ enum: RECOMMENDATION_TYPES, example: 'Combination' })
  @IsString()
  @IsIn(RECOMMENDATION_TYPES)
  recommendationType: string;

  @ApiPropertyOptional({ example: 'Patient is young with good performance status, tumor is resectable with adequate margins' })
  @IsOptional()
  @IsString()
  rationale?: string;

  @ApiPropertyOptional({ example: 'Upfront surgery was discussed but chemotherapy first preferred due to tumor size' })
  @IsOptional()
  @IsString()
  alternativeOptions?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  consensus?: boolean;

  @ApiPropertyOptional({ example: 'Dr. Brown suggested upfront surgery instead' })
  @IsOptional()
  @IsString()
  dissent?: string;

  @ApiProperty({ example: 'Dr. Smith' })
  @IsString()
  documentedBy: string;
}

export class UpdateCpcConferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  conferenceDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attendees?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  presentation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recommendation?: string;

  @ApiPropertyOptional({ enum: RECOMMENDATION_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(RECOMMENDATION_TYPES)
  recommendationType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rationale?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alternativeOptions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  consensus?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dissent?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentedBy?: string;
}
