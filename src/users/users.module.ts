/**
 * Modulo NestJS dedicato alla gestione degli utenti.
 * Raggruppa modello, servizio e controller relativi alla risorsa "User".
 * Esporta UsersService per permetterne l'utilizzo in altri moduli (es. AuthModule).
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.model';

@Module({
  /**
   * Registra il modello User all'interno di Sequelize per questo modulo,
   * permettendo l'iniezione del modello nei servizi.
   */
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
