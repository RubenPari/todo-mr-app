import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard per proteggere le route che richiedono autenticazione JWT.
 * Utilizza la strategia 'jwt' di Passport per validare i token nelle richieste.
 * Se il token non è valido o mancante, la richiesta viene rifiutata con un errore 401.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
