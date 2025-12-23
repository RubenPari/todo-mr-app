import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Dto per la login degli utenti
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
