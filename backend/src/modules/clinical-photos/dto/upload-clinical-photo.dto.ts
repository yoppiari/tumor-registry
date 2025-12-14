import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ViewType {
  ANTERIOR = 'ANTERIOR',
  POSTERIOR = 'POSTERIOR',
  LATERAL_LEFT = 'LATERAL_LEFT',
  LATERAL_RIGHT = 'LATERAL_RIGHT',
  OTHER = 'OTHER',
}

export class UploadClinicalPhotoDto {
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  anatomicalLocation?: string;

  @IsOptional()
  @IsEnum(ViewType)
  viewType?: ViewType;

  @IsOptional()
  @IsString()
  description?: string;
}
