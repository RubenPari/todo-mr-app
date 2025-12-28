/**
 * Modulo NestJS dedicato alla gestione dei task.
 * Raggruppa modello, servizio e controller relativi alla risorsa "Task".
 * Tutti gli endpoint sono protetti da autenticazione JWT e permettono
 * agli utenti di gestire solo i propri task.
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskOwnershipGuard } from './guards/task-ownership.guard';
import { Task } from './task.model';
import { UsersModule } from '../users/users.module';

@Module({
  /**
   * Registra il modello Task per l'uso con Sequelize in questo modulo
   * e importa UsersModule per permettere al TasksService di verificare
   * l'esistenza degli utenti prima di creare task associati.
   */
  imports: [SequelizeModule.forFeature([Task]), UsersModule],
  controllers: [TasksController],
  providers: [TasksService, TaskOwnershipGuard],
  exports: [TasksService],
})
export class TasksModule {}
