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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';
import { TasksService } from './tasks.service';
import { TaskOwnershipGuard } from './guards/task-ownership.guard';
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
   * @param user - Utente autenticato (estratto tramite @CurrentUser decorator)
   * @param dto - Dati del task da creare
   * @returns Il task creato
   */
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.createForUser(user.userId, dto);
  }

  /**
   * Restituisce tutti i task dell'utente attualmente autenticato.
   *
   * @param user - Utente autenticato (estratto tramite @CurrentUser decorator)
   * @returns Array di tutti i task dell'utente
   */
  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.tasksService.findAllForUser(user.userId);
  }

  /**
   * Restituisce un singolo task dell'utente autenticato.
   * La verifica della proprietà è gestita da TaskOwnershipGuard.
   *
   * @param id - ID del task da recuperare
   * @returns Il task trovato (già verificato dalla guard)
   */
  @Get(':id')
  @UseGuards(TaskOwnershipGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Il task è già stato verificato e attaccato alla richiesta dalla guard
    return this.tasksService.findOne(id);
  }

  /**
   * Aggiorna un task dell'utente autenticato.
   * La verifica della proprietà è gestita da TaskOwnershipGuard.
   *
   * @param id - ID del task da aggiornare
   * @param dto - Dati parziali da applicare al task
   * @returns Il task aggiornato
   */
  @Patch(':id')
  @UseGuards(TaskOwnershipGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  /**
   * Elimina un task dell'utente autenticato.
   * La verifica della proprietà è gestita da TaskOwnershipGuard.
   *
   * @param id - ID del task da eliminare
   */
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(TaskOwnershipGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);
  }
}
