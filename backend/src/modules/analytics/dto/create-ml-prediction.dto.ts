import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMLPredictionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Treatment plan ID' })
  @IsString()
  @IsNotEmpty()
  treatmentPlanId: string;

  @ApiProperty({ description: 'Prediction type', enum: ['survival', 'response', 'toxicity'] })
  @IsString()
  @IsNotEmpty()
  predictionType: 'survival' | 'response' | 'toxicity';

  @ApiProperty({ description: 'Features for prediction' })
  @IsOptional()
  features?: any;
}