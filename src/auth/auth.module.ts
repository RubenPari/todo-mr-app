/**
 * Modulo NestJS per la gestione dell'autenticazione con JWT.
 * Configura Passport con strategia JWT e fornisce servizi e controller
 * per la registrazione, login e gestione del profilo utente autenticato.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    /**
     * Configurazione del modulo JWT con chiave segreta e durata del token.
     * Il token JWT ha una durata di 1 ora prima della scadenza.
     */
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
