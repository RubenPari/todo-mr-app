/**
 * Data Transfer Object per la creazione di un nuovo utente.
 * Definisce la forma dei dati accettati dall'API e le regole di validazione.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  /**
   * Nome completo dell'utente.
   * Deve essere una stringa non vuota.
   */
  @ApiProperty({ example: 'Mario Rossi' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  /**
   * Email univoca dell'utente.
   * Deve essere un indirizzo email valido e non può essere vuoto.
   * Deve essere univoca nel sistema (viene verificato a livello di database).
   */
  @ApiProperty({ example: 'mario.rossi@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  /**
   * Password dell'utente per l'autenticazione.
   * Deve essere una stringa di almeno 8 caratteri.
   * Viene hashata con bcrypt prima del salvataggio nel database.
   */
  @ApiProperty({ example: 'Str0ngP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password!: string;
}
