import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
import { UsersService } from './users.service';
import { User } from './user.model';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: { create: jest.Mock; findByPk: jest.Mock };

  beforeEach(async () => {
    userModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: userModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('dovrebbe lanciare ConflictException quando l\'email è duplicata', async () => {
    userModel.create.mockRejectedValue(
      new UniqueConstraintError({ errors: [] as any }),
    );

    await expect(
      service.create({ name: 'Mario', email: 'dup@example.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('dovrebbe creare correttamente un utente quando i dati sono validi e unici', async () => {
    const createdUser = { id: 1, name: 'Mario', email: 'ok@example.com' } as User;
    userModel.create.mockResolvedValue(createdUser);

    const result = await service.create({
      name: 'Mario',
      email: 'ok@example.com',
    });

    expect(result).toBe(createdUser);
    expect(userModel.create).toHaveBeenCalledWith({
      name: 'Mario',
      email: 'ok@example.com',
    } as any);
  });
});
