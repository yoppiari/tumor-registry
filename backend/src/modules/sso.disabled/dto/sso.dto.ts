import { IsString, IsBoolean, IsObject, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SsoProvider {
  SAML2 = 'SAML2',
  OIDC = 'OIDC',
  OAUTH2 = 'OAUTH2',
}

export class CreateSsoConfigDto {
  @ApiProperty({ enum: SsoProvider })
  @IsEnum(SsoProvider)
  provider: SsoProvider;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  providerName: string;

  @ApiProperty({ description: 'Provider-specific configuration (SAML metadata, OIDC discovery, etc.)' })
  @IsObject()
  configuration: any;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoProvision?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  defaultRole?: string;

  @ApiPropertyOptional({ description: 'Mapping of SSO attributes to user fields' })
  @IsObject()
  @IsOptional()
  attributeMapping?: any;
}

export class UpdateSsoConfigDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  providerName?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  configuration?: any;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  autoProvision?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  defaultRole?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  attributeMapping?: any;
}

export class SsoLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  configId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  samlResponse?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  oidcToken?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;
}
