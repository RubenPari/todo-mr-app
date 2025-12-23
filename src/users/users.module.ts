// Modulo NestJS dedicato alla gestione degli utenti.
// Raggruppa modello, servizio e controller relativi alla risorsa "User".
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.model';

@Module({
  // Registra il modello User all'interno di Sequelize per questo modulo.
  imports: [SequelizeModule.forFeature([User])],
  // Controller HTTP esposti da questo modulo.
  controllers: [UsersController],
  // Servizi disponibili per injection.
  providers: [UsersService],
  // Esporta UsersService per poterlo riutilizzare in altri moduli se necessario.
  exports: [UsersService],
})
export class UsersModule {}
