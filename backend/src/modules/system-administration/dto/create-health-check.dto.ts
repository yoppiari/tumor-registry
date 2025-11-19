import { IsString, IsOptional, IsBoolean, IsJSON, IsEnum, IsInt } from 'class-validator';

export enum HealthCheckType {
  HTTP_ENDPOINT = 'HTTP_ENDPOINT',
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  FILE_SYSTEM = 'FILE_SYSTEM',
  SERVICE_PORT = 'SERVICE_PORT',
  API_HEALTH = 'API_HEALTH',
  SSL_CERTIFICATE = 'SSL_CERTIFICATE',
  DOMAIN_DNS = 'DOMAIN_DNS',
  NETWORK_CONNECTIVITY = 'NETWORK_CONNECTIVITY',
  CUSTOM_CHECK = 'CUSTOM_CHECK',
}

export class CreateHealthCheckDto {
  @IsString()
  serviceName: string;

  @IsEnum(HealthCheckType)
  checkType: HealthCheckType;

  @IsOptional()
  @IsString()
  endpoint?: string;

  @IsOptional()
  @IsInt()
  expectedStatus?: number;

  @IsOptional()
  @IsInt()
  timeout?: number;

  @IsOptional()
  @IsInt()
  interval?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  threshold?: number;

  @IsOptional()
  @IsJSON()
  configuration?: any;

  @IsOptional()
  @IsString()
  createdBy?: string;
}