import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object per l'autenticazione degli utenti.
 * Definisce la struttura dei dati richiesti per effettuare il login.
 */
export class LoginDto {
  /**
   * Email dell'utente che sta effettuando il login.
   * Deve essere un indirizzo email valido e non può essere vuoto.
   */
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  /**
   * Password dell'utente per l'autenticazione.
   * Deve essere una stringa non vuota.
   */
  @IsString()
  @IsNotEmpty()
  password!: string;
}
