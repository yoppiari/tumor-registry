import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
  @IsEmail({}, { message: 'Email harus valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email: string;
}