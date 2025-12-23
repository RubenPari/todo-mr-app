// Servizio applicativo per la gestione dei task.
// Incapsula tutta la logica di accesso al database relativa alla risorsa Task.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  // Il model Sequelize viene iniettato tramite InjectModel.
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  // Crea un nuovo task associato a un determinato utente.
  createForUser(userId: number, dto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create({ ...dto, userId });
  }

  // Restituisce tutti i task appartenenti a uno specifico utente.
  findAllForUser(userId: number): Promise<Task[]> {
    return this.taskModel.findAll({ where: { userId } });
  }

  // Restituisce un singolo task per id oppure lancia NotFoundException.
  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  // Aggiorna un task esistente con i dati forniti nel DTO di update.
  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    return task.update(dto);
  }

  // Elimina definitivamente un task dal database.
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }
}
