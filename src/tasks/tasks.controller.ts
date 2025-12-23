// Controller HTTP per la risorsa "Task".
// Espone endpoint REST per creare, leggere, aggiornare ed eliminare task,
// inclusi endpoint annidati sotto uno specifico utente.
import {
  Body,
  Controller,
  Delete,
  Get,
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

// Tag Swagger per raggruppare tutti gli endpoint dei task.
@ApiTags('tasks')
// Nessun prefisso: le route sono definite direttamente sugli handler (es. users/:userId/tasks).
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Crea un nuovo task per l'utente specificato.
  @Post('users/:userId/tasks')
  @ApiCreatedResponse({ type: Task })
  createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createForUser(userId, dto);
  }

  // Restituisce tutti i task dell'utente specificato.
  @Get('users/:userId/tasks')
  @ApiOkResponse({ type: [Task] })
  findAllForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Task[]> {
    return this.tasksService.findAllForUser(userId);
  }

  // Restituisce un singolo task per id.
  @Get('tasks/:id')
  @ApiOkResponse({ type: Task })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  // Aggiorna un task esistente.
  @Patch('tasks/:id')
  @ApiOkResponse({ type: Task })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  // Elimina un task.
  @Delete('tasks/:id')
  @ApiOkResponse({ description: 'Task deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.remove(id);
  }
}
