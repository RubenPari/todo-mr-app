/**
 * Interfaccia che rappresenta il payload del token JWT dopo la decodifica.
 */
export interface JwtPayload {
  sub: number; // ID dell'utente
  email: string;
}

/**
 * Interfaccia che rappresenta l'utente autenticato allegato alla richiesta.
 * Viene popolata da JwtStrategy.validate dopo la validazione del token.
 */
export interface AuthenticatedUser {
  userId: number;
  email: string;
}
