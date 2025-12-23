// DTO per la creazione di un nuovo utente.
// Definisce la forma dei dati accettati dall'API e le regole di validazione.
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
