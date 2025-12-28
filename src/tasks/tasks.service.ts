/**
 * Servizio applicativo per la gestione dei task.
 * Incapsula tutta la logica di accesso al database relativa alla risorsa Task,
 * inclusa la validazione dell'esistenza degli utenti associati.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
    /**
     * UsersService viene iniettato per verificare che l'utente esista
     * prima di creare un task a suo nome.
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * Crea un nuovo task associato a un determinato utente.
   * Verifica che l'utente esista prima di creare il task.
   *
   * @param userId - ID dell'utente proprietario del task
   * @param dto - Dati del task da creare
   * @returns Il task creato
   * @throws {NotFoundException} Se l'utente specificato non esiste
   */
  async createForUser(userId: number, dto: CreateTaskDto): Promise<Task> {
    await this.usersService.findOne(userId);
    const payload = {
      title: dto.title,
      description: dto.description ?? null,
      completed: dto.completed ?? false,
      userId,
    };
    return this.taskModel.create(payload);
  }

  /**
   * Restituisce tutti i task appartenenti a uno specifico utente.
   *
   * @param userId - ID dell'utente di cui recuperare i task
   * @returns Array di tutti i task dell'utente specificato
   */
  findAllForUser(userId: number): Promise<Task[]> {
    return this.taskModel.findAll({ where: { userId } });
  }

  /**
   * Restituisce un singolo task identificato dal suo ID.
   *
   * @param id - ID numerico del task da cercare
   * @returns Il task trovato
   * @throws {NotFoundException} Se il task con l'ID specificato non esiste
   */
  async findOne(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  /**
   * Aggiorna un task esistente con i dati forniti.
   *
   * @param id - ID del task da aggiornare
   * @param dto - Dati parziali da applicare al task
   * @returns Il task aggiornato
   * @throws {NotFoundException} Se il task con l'ID specificato non esiste
   */
  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    return task.update(dto);
  }

  /**
   * Elimina un task (soft delete).
   * Il task non viene rimosso permanentemente, ma viene marcato come eliminato
   * impostando il campo deletedAt. Può essere ripristinato con restore().
   *
   * @param id - ID del task da eliminare
   * @throws {NotFoundException} Se il task con l'ID specificato non esiste
   */
  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }

  /**
   * Ripristina un task precedentemente eliminato (soft delete).
   *
   * @param id - ID del task da ripristinare
   * @returns Il task ripristinato
   * @throws {NotFoundException} Se il task con l'ID specificato non esiste
   */
  async restore(id: number): Promise<Task> {
    const task = await this.taskModel.findByPk(id, { paranoid: false });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    if (!task.deletedAt) {
      throw new NotFoundException(`Task with id ${id} is not deleted`);
    }
    task.deletedAt = null;
    await task.save();
    return task;
  }

  /**
   * Elimina permanentemente un task dal database (hard delete).
   * ATTENZIONE: Questa operazione è irreversibile.
   *
   * @param id - ID del task da eliminare permanentemente
   * @throws {NotFoundException} Se il task con l'ID specificato non esiste
   */
  async hardRemove(id: number): Promise<void> {
    const task = await this.taskModel.findByPk(id, { paranoid: false });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    await task.destroy({ force: true });
  }
}
