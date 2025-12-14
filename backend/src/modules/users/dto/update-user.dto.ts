import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsUUID,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  kolegiumId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(16)
  @MaxLength(16)
  nik?: string;

  @IsOptional()
  @IsUUID('4')
  centerId?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
