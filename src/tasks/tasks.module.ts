// Modulo NestJS dedicato alla gestione dei task.
// Raggruppa modello, servizio e controller relativi alla risorsa "Task".
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

@Module({
  // Registra il modello Task per l'uso con Sequelize in questo modulo.
  imports: [SequelizeModule.forFeature([Task])],
  // Controller HTTP per i task.
  controllers: [TasksController],
  // Servizi disponibili per injection.
  providers: [TasksService],
  // Esporta TasksService per l'utilizzo in altri moduli.
  exports: [TasksService],
})
export class TasksModule {}
