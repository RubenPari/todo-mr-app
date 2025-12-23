// Endpoint protetti per gestire i task dell'utente autenticato
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
export class MeTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createForMe(@Request() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.createForUser(req.user.userId, dto);
  }

  @Get()
  listForMe(@Request() req: any) {
    return this.tasksService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  async getOneForMe(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const task = await this.tasksService.findOne(id);
    if (task.userId !== req.user.userId) {
      // maschera risorse di altri utenti
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  @Patch(':id')
  async updateForMe(
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

  @Delete(':id')
  @HttpCode(204)
  async removeForMe(
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
