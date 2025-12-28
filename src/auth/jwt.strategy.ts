import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  JwtPayload,
  AuthenticatedUser,
} from './interfaces/jwt-payload.interface';

/**
 * Strategia Passport per la validazione dei token JWT.
 * Estrae il token dall'header Authorization e lo valida usando la chiave segreta.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Valida il payload del token JWT e restituisce i dati dell'utente.
   * Questo metodo viene chiamato automaticamente da Passport dopo la validazione del token.
   *
   * @param payload - Payload decodificato del token JWT
   * @returns Oggetto contenente i dati minimi dell'utente da allegare alla richiesta
   */
  validate(payload: JwtPayload): AuthenticatedUser {
    return { userId: payload.sub, email: payload.email };
  }
}
