// DTO per la creazione di un nuovo utente.
// Definisce la forma dei dati accettati dall'API e le regole di validazione.
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  // Nome completo dell'utente.
  @ApiProperty({ example: 'Mario Rossi' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  // Email univoca dell'utente.
  @ApiProperty({ example: 'mario.rossi@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  // Password dell'utente (min 8 caratteri).
  @ApiProperty({ example: 'Str0ngP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password!: string;
}
