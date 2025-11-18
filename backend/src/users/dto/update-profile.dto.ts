import {
  IsString,
  IsOptional,
  IsArray,
  IsEmail,
  MaxLength,
  Matches,
  MinLength,
  ArrayMinSize,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Nama harus berupa string' })
  @MaxLength(255, { message: 'Nama maksimal 255 karakter' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Telepon harus berupa string' })
  @Matches(/^(\+62|62)?[0-9]+$/, { message: 'Format telepon tidak valid' })
  @MaxLength(20, { message: 'Telepon maksimal 20 karakter' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Avatar harus berupa string' })
  @MaxLength(500, { message: 'URL avatar maksimal 500 karakter' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'Department harus berupa string' })
  @MaxLength(100, { message: 'Department maksimal 100 karakter' })
  department?: string;

  @IsOptional()
  @IsString({ message: 'Nomor lisensi harus berupa string' })
  @MaxLength(50, { message: 'Nomor lisensi maksimal 50 karakter' })
  licenseNumber?: string;

  @IsOptional()
  @IsArray({ message: 'Spesialisasi harus berupa array' })
  @IsString({ each: true, message: 'Setiap spesialisasi harus berupa string' })
  @ArrayMinSize(1, { message: 'Minimal harus ada 1 spesialisasi' })
  @MaxLength(10, { each: true, message: 'Setiap spesialisasi maksimal 10 karakter' })
  specialization?: string[];

  @IsOptional()
  @IsString({ message: 'Bio harus berupa string' })
  @MaxLength(1000, { message: 'Bio maksimal 1000 karakter' })
  bio?: string;
}