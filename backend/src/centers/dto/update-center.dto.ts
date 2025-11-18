import {
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsArray,
  IsOptional,
  Min,
  Max,
  MaxLength,
  Matches,
  IsObject,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { CenterType } from './create-center.dto';

class CoordinatesDto {
  @IsNumber({}, { message: 'Latitude harus berupa angka' })
  @Min(-90, { message: 'Latitude minimal -90' })
  @Max(90, { message: 'Latitude maksimal 90' })
  latitude: number;

  @IsNumber({}, { message: 'Longitude harus berupa angka' })
  @Min(-180, { message: 'Longitude minimal -180' })
  @Max(180, { message: 'Longitude maksimal 180' })
  longitude: number;
}

export class UpdateCenterDto {
  @IsOptional()
  @IsString({ message: 'Nama harus berupa string' })
  @MaxLength(255, { message: 'Nama maksimal 255 karakter' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Kode harus berupa string' })
  @Matches(/^[A-Z0-9-]{3,20}$/, { message: 'Kode hanya boleh huruf besar, angka, dan dash (3-20 karakter)' })
  code?: string;

  @IsOptional()
  @IsEnum(CenterType, { message: 'Tipe center tidak valid' })
  type?: CenterType;

  @IsOptional()
  @IsString({ message: 'Alamat harus berupa string' })
  @MaxLength(500, { message: 'Alamat maksimal 500 karakter' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Kota harus berupa string' })
  @MaxLength(100, { message: 'Kota maksimal 100 karakter' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'Provinsi harus berupa string' })
  @MaxLength(100, { message: 'Provinsi maksimal 100 karakter' })
  province?: string;

  @IsOptional()
  @IsString({ message: 'Kode pos harus berupa string' })
  @Matches(/^\d{5}$/, { message: 'Kode pos harus 5 digit angka' })
  postalCode?: string;

  @IsOptional()
  @IsString({ message: 'Telepon harus berupa string' })
  @Matches(/^(\+62|62)?[0-9]+$/, { message: 'Format telepon tidak valid' })
  @MaxLength(20, { message: 'Telepon maksimal 20 karakter' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email tidak valid' })
  email?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Kapasitas harus berupa angka' })
  @Min(1, { message: 'Kapasitas minimal 1' })
  capacity?: number;

  @IsOptional()
  @IsObject({ message: 'Koordinat harus berupa object' })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @IsOptional()
  @IsArray({ message: 'Spesialisasi harus berupa array' })
  @IsString({ each: true, message: 'Setiap spesialisasi harus berupa string' })
  specialties?: string[];

  @IsOptional()
  @IsArray({ message: 'Layanan harus berupa array' })
  @IsString({ each: true, message: 'Setiap layanan harus berupa string' })
  services?: string[];

  @IsOptional()
  @IsBoolean({ message: 'Status aktif harus berupa boolean' })
  isActive?: boolean;
}