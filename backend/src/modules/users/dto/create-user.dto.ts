import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

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

  @IsUUID('4')
  centerId: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
