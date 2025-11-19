import { IsString, IsOptional, IsBoolean, IsJSON, IsEnum, ValidateIf } from 'class-validator';

export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export class CreateConfigDto {
  @IsString()
  category: string;

  @IsString()
  key: string;

  @IsJSON()
  value: any;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsJSON()
  defaultValue?: any;

  @IsOptional()
  @IsJSON()
  validationRules?: any;

  @IsOptional()
  @IsEnum(Environment)
  environment?: string;

  @IsOptional()
  @IsString()
  centerId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}