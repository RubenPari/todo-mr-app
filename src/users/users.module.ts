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
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
