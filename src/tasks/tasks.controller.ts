/**
 * Controller HTTP per la gestione dei task dell'utente autenticato.
 * Tutti gli endpoint richiedono autenticazione JWT e permettono all'utente
 * di gestire solo i propri task, garantendo l'isolamento delle risorse.
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
  Request,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@Controller('me/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Crea un nuovo task per l'utente attualmente autenticato.
   *
   * @param req - Oggetto request contenente i dati dell'utente autenticato
   * @param dto - Dati del task da creare
   * @returns Il task creato
   */
  @Post()
  create(@Request() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.createForUser(req.user.userId, dto);
  }

  /**
   * Restituisce tutti i task dell'utente attualmente autenticato.
   *
   * @param req - Oggetto request contenente i dati dell'utente autenticato
   * @returns Array di tutti i task dell'utente
   */
  @Get()
  findAll(@Request() req: any) {
    return this.tasksService.findAllForUser(req.user.userId);
  }

  /**
   * Restituisce un singolo task dell'utente autenticato.
   * Se il task appartiene a un altro utente, viene restituito un errore 404
   * per mascherare l'esistenza della risorsa (security by obscurity).
   *
   * @param req - Oggetto request contenente i dati dell'utente autenticato
   * @param id - ID del task da recuperare
   * @returns Il task trovato
   * @throws {NotFoundException} Se il task non esiste o appartiene a un altro utente
   */
  @Get(':id')
  async findOne(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const task = await this.tasksService.findOne(id);
    if (task.userId !== req.user.userId) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  /**
   * Aggiorna un task dell'utente autenticato.
   * Se il task appartiene a un altro utente, viene restituito un errore 404.
   *
   * @param req - Oggetto request contenente i dati dell'utente autenticato
   * @param id - ID del task da aggiornare
   * @param dto - Dati parziali da applicare al task
   * @returns Il task aggiornato
   * @throws {NotFoundException} Se il task non esiste o appartiene a un altro utente
   */
  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.findOne(id);
    if (task.userId !== req.user.userId) {
      throw new NotFoundException('Task not found');
    }
    return this.tasksService.update(id, dto);
  }

  /**
   * Elimina un task dell'utente autenticato.
   * Se il task appartiene a un altro utente, viene restituito un errore 404.
   *
   * @param req - Oggetto request contenente i dati dell'utente autenticato
   * @param id - ID del task da eliminare
   * @throws {NotFoundException} Se il task non esiste o appartiene a un altro utente
   */
  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const task = await this.tasksService.findOne(id);
    if (task.userId !== req.user.userId) {
      throw new NotFoundException('Task not found');
    }
    await this.tasksService.remove(id);
  }
}

