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

@ApiTags('tasks')
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('users/:userId/tasks')
  @ApiCreatedResponse({ type: Task })
  createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createForUser(userId, dto);
  }

  @Get('users/:userId/tasks')
  @ApiOkResponse({ type: [Task] })
  findAllForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Task[]> {
    return this.tasksService.findAllForUser(userId);
  }

  @Get('tasks/:id')
  @ApiOkResponse({ type: Task })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch('tasks/:id')
  @ApiOkResponse({ type: Task })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, dto);
  }

  @Delete('tasks/:id')
  @ApiOkResponse({ description: 'Task deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.remove(id);
  }
}
