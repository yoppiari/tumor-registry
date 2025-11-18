import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'Token tidak boleh kosong' })
  @IsString({ message: 'Token harus berupa string' })
  token: string;
}