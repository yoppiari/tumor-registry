import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { IsOptional, IsDateString, IsBoolean, IsEnum, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'Patient full name' })
  name?: string;

  @IsOptional()
  @IsEnum(['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'])
  @ApiPropertyOptional({
    enum: ['new', 'ongoing', 'completed', 'palliative', 'lost_to_followup', 'deceased'],
    description: 'Treatment status'
  })
  treatmentStatus?: 'new' | 'ongoing' | 'completed' | 'palliative' | 'lost_to_followup' | 'deceased';

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Patient deceased status' })
  isDeceased?: boolean;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of death', type: 'string', format: 'date' })
  dateOfDeath?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @ApiPropertyOptional({ description: 'Cause of death' })
  causeOfDeath?: string;
}