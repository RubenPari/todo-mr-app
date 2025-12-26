import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Servizio per la gestione dell'autenticazione degli utenti.
 * Fornisce metodi per validare le credenziali e generare token JWT.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
  ) {}

  /**
   * Valida le credenziali di un utente confrontando email e password.
   *
   * @param email - Email dell'utente da autenticare
   * @param password - Password in chiaro da verificare
   * @returns L'utente autenticato se le credenziali sono valide
   * @throws {UnauthorizedException} Se l'email non esiste o la password non corrisponde
   */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Credenziali non valide');
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Credenziali non valide');
    }
    return user;
  }

  /**
   * Esegue il login di un utente e genera un token JWT di accesso.
   *
   * @param email - Email dell'utente
   * @param password - Password dell'utente
   * @returns Oggetto contenente il token JWT di accesso
   * @throws {UnauthorizedException} Se le credenziali non sono valide
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwt.signAsync(payload) };
  }
}
