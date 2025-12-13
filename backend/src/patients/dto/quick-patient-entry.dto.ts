import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuickPatientEntryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({ description: 'Patient full name', example: 'John Doe' })
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^[+]?[0-9]{10,15}$/, { message: 'Phone number must be 10-15 digits, may start with +' })
  @ApiPropertyOptional({ description: 'Phone number', example: '+62812345678' })
  phone?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Date of birth (YYYY-MM-DD)', type: 'string', format: 'date' })
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(['male', 'female'])
  @ApiPropertyOptional({ enum: ['male', 'female'], description: 'Gender' })
  gender?: 'male' | 'female';

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9\-\/]+$/, { message: 'Medical record number can only contain letters, numbers, hyphens, and slashes' })
  @ApiPropertyOptional({ description: 'Medical record number (No. RM)', example: 'RM20240001' })
  medicalRecordNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiPropertyOptional({ description: 'Primary cancer site', example: 'Breast' })
  primarySite?: string;

  @IsOptional()
  @IsEnum(['I', 'II', 'III', 'IV'])
  @ApiPropertyOptional({ enum: ['I', 'II', 'III', 'IV'], description: 'Cancer stage' })
  cancerStage?: 'I' | 'II' | 'III' | 'IV';

  @IsEnum(['new', 'ongoing', 'completed', 'palliative'])
  @ApiProperty({
    enum: ['new', 'ongoing', 'completed', 'palliative'],
    description: 'Treatment status'
  })
  treatmentStatus: 'new' | 'ongoing' | 'completed' | 'palliative';
}

export class ChatMessageDto {
  @IsString()
  @ApiProperty({ description: 'Message content' })
  content: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Field name being updated' })
  fieldName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Session ID for chat-based entry' })
  sessionId?: string;
}

export class PatientEntrySessionDto {
  @IsString()
  @ApiProperty({ description: 'Session ID' })
  sessionId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Patient ID if exists' })
  patientId?: string;

  @IsOptional()
  @IsEnum(['in_progress', 'completed', 'abandoned'])
  @ApiPropertyOptional({
    enum: ['in_progress', 'completed', 'abandoned'],
    description: 'Session status'
  })
  status?: 'in_progress' | 'completed' | 'abandoned';

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Current step in form' })
  currentStep?: number;
}