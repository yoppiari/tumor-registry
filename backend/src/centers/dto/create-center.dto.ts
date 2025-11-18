import {
  IsString,
  IsNotEmpty,
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
  ValidateNested,
  IsNumberString
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CenterType {
  HOSPITAL = 'hospital',
  CLINIC = 'clinic',
  LABORATORY = 'laboratory',
  RESEARCH_CENTER = 'research_center',
}

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

export class CreateCenterDto {
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString({ message: 'Nama harus berupa string' })
  @MaxLength(255, { message: 'Nama maksimal 255 karakter' })
  name: string;

  @IsNotEmpty({ message: 'Kode tidak boleh kosong' })
  @IsString({ message: 'Kode harus berupa string' })
  @Matches(/^[A-Z0-9-]{3,20}$/, { message: 'Kode hanya boleh huruf besar, angka, dan dash (3-20 karakter)' })
  code: string;

  @IsNotEmpty({ message: 'Tipe center tidak boleh kosong' })
  @IsEnum(CenterType, { message: 'Tipe center tidak valid' })
  type: CenterType;

  @IsNotEmpty({ message: 'Alamat tidak boleh kosong' })
  @IsString({ message: 'Alamat harus berupa string' })
  @MaxLength(500, { message: 'Alamat maksimal 500 karakter' })
  address: string;

  @IsNotEmpty({ message: 'Kota tidak boleh kosong' })
  @IsString({ message: 'Kota harus berupa string' })
  @MaxLength(100, { message: 'Kota maksimal 100 karakter' })
  city: string;

  @IsNotEmpty({ message: 'Provinsi tidak boleh kosong' })
  @IsString({ message: 'Provinsi harus berupa string' })
  @MaxLength(100, { message: 'Provinsi maksimal 100 karakter' })
  province: string;

  @IsNotEmpty({ message: 'Kode pos tidak boleh kosong' })
  @IsString({ message: 'Kode pos harus berupa string' })
  @Matches(/^\d{5}$/, { message: 'Kode pos harus 5 digit angka' })
  postalCode: string;

  @IsNotEmpty({ message: 'Telepon tidak boleh kosong' })
  @IsString({ message: 'Telepon harus berupa string' })
  @Matches(/^(\+62|62)?[0-9]+$/, { message: 'Format telepon tidak valid' })
  @MaxLength(20, { message: 'Telepon maksimal 20 karakter' })
  phone: string;

  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @IsNotEmpty({ message: 'Kapasitas tidak boleh kosong' })
  @IsNumber({}, { message: 'Kapasitas harus berupa angka' })
  @Min(1, { message: 'Kapasitas minimal 1' })
  capacity: number;

  @IsOptional()
  @IsObject({ message: 'Koordinat harus berupa object' })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @IsArray({ message: 'Spesialisasi harus berupa array' })
  @IsString({ each: true, message: 'Setiap spesialisasi harus berupa string' })
  specialties: string[];

  @IsArray({ message: 'Layanan harus berupa array' })
  @IsString({ each: true, message: 'Setiap layanan harus berupa string' })
  services: string[];
}