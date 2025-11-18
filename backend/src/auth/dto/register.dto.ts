import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
  DATA_ENTRY = 'data_entry',
  RESEARCHER = 'researcher',
  ADMIN = 'admin',
  NATIONAL_STAKEHOLDER = 'national_stakeholder',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;

  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  @IsString({ message: 'Nama harus berupa string' })
  name: string;

  @IsEnum(UserRole, { message: 'Role harus salah satu dari: data_entry, researcher, admin, national_stakeholder' })
  @IsNotEmpty({ message: 'Role tidak boleh kosong' })
  role: UserRole;

  @IsOptional()
  @IsString({ message: 'Nomor telepon harus berupa string' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Center ID harus berupa string' })
  centerId?: string;
}