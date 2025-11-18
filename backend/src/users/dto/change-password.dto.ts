import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Password saat ini tidak boleh kosong' })
  @IsString({ message: 'Password saat ini harus berupa string' })
  currentPassword: string;

  @IsNotEmpty({ message: 'Password baru tidak boleh kosong' })
  @IsString({ message: 'Password baru harus berupa string' })
  @MinLength(8, { message: 'Password baru minimal 8 karakter' })
  @MaxLength(128, { message: 'Password baru maksimal 128 karakter' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password baru harus mengandung minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 karakter spesial',
    },
  )
  newPassword: string;

  @IsNotEmpty({ message: 'Konfirmasi password tidak boleh kosong' })
  @IsString({ message: 'Konfirmasi password harus berupa string' })
  confirmPassword: string;
}