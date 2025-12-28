/**
 * Decorator personalizzato per estrarre l'utente autenticato dalla richiesta.
 * Fornisce type safety migliorata rispetto all'uso diretto di @Request().
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

