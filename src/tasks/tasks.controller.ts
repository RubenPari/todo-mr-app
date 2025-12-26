/**
 * Controller HTTP per la risorsa "Task".
 * Espone endpoint REST per creare, leggere, aggiornare ed eliminare task,
 * inclusi endpoint annidati sotto uno specifico utente.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.model';

@ApiTags('tasks')
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Crea un nuovo task per l'utente specificato.
   *
   * @param userId - ID dell'utente proprietario del task
   * @param dto - Dati del task da creare
   * @returns Il task creato
   * @throws {NotFoundException} Se l'utente specificato non esiste
   */
  @Post('users/:userId/tasks')
  @ApiCreatedResponse({ type: Task })
  createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createForUser(userId, dto);
  }

  /**
   * Restituisce tutti i task dell'utente specificato.
   *
   * @param userId - ID dell'utente di cui recuperare i task
   * @returns Array di tutti i task dell'utente
   */
  @Get('users/:userId/tasks')
  @ApiOkResponse({ type: [Task] })
  findAllForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Task[]> {
    return this.tasksService.findAllForUser(userId);
  }

  /**
   * Restituisce un singolo task identificato dal suo ID.
   *
   * @param id - ID numerico del task
   * @returns Il task trovato
   * @throws {NotFoundException} Se il task non esiste
   */
  @Get('tasks/:id')
  @ApiOkResponse({ type: Task })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  /**
   * Aggiorna un task esistente con i dati forniti.
   *
   * @param id - ID del task da aggiornare
   * @param dto - Dati parziali da applicare al task
   * @returns Il task aggiornato
   * @throws {NotFoundException} Se il task non esiste
   */
  @Patch('tasks/:id')
  @ApiOkResponse({ type: Task })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  /**
   * Elimina definitivamente un task dal sistema.
   *
   * @param id - ID del task da eliminare
   * @throws {NotFoundException} Se il task non esiste
   */
  @Delete('tasks/:id')
  @HttpCode(204)
  @ApiOkResponse({ description: 'Task deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.remove(id);
  }
}
