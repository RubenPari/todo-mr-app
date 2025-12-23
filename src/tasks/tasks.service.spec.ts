import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { UsersService } from '../users/users.service';

describe('TasksService', () => {
  let service: TasksService;
  let taskModel: { create: jest.Mock; findByPk: jest.Mock; findAll: jest.Mock };
  let usersService: { findOne: jest.Mock };

  beforeEach(async () => {
    taskModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    usersService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken(Task),
          useValue: taskModel,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('dovrebbe lanciare NotFoundException quando si crea un task per un utente inesistente', async () => {
    usersService.findOne.mockRejectedValue(new NotFoundException());

    await expect(
      service.createForUser(123, { title: 'Task test' } as any),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(taskModel.create).not.toHaveBeenCalled();
  });

  it('dovrebbe creare un task quando l\'utente esiste', async () => {
    const createdTask = { id: 1, title: 'Task test', userId: 123 } as Task;
    usersService.findOne.mockResolvedValue({ id: 123 });
    taskModel.create.mockResolvedValue(createdTask);

    const result = await service.createForUser(123, {
      title: 'Task test',
    } as any);

    expect(usersService.findOne).toHaveBeenCalledWith(123);
    expect(taskModel.create).toHaveBeenCalledWith({
      title: 'Task test',
      userId: 123,
    } as any);
    expect(result).toBe(createdTask);
  });
});
