/**
 * Modulo NestJS dedicato alla gestione dei task.
 * Raggruppa modello, servizio e controller relativi alla risorsa "Task".
 * Include due controller: uno per la gestione generale dei task e uno
 * per la gestione dei task dell'utente autenticato.
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller';
import { MeTasksController } from './me.tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { UsersModule } from '../users/users.module';

@Module({
  /**
   * Registra il modello Task per l'uso con Sequelize in questo modulo
   * e importa UsersModule per permettere al TasksService di verificare
   * l'esistenza degli utenti prima di creare task associati.
   */
  imports: [SequelizeModule.forFeature([Task]), UsersModule],
  controllers: [TasksController, MeTasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
