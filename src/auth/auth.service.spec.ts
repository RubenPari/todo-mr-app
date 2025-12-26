/**
 * Test unitari per AuthService.
 * Verifica la logica di autenticazione e generazione token JWT.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const bcryptCompare = bcrypt.compare as jest.MockedFunction<
  typeof bcrypt.compare
>;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmailWithPassword: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findByEmailWithPassword: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('dovrebbe lanciare UnauthorizedException quando l\'email non esiste', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('dovrebbe lanciare UnauthorizedException quando la password è sbagliata', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
      };

      usersService.findByEmailWithPassword.mockResolvedValue(user);
      bcryptCompare.mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongPassword'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(bcryptCompare).toHaveBeenCalledWith('wrongPassword', user.password);
    });

    it('dovrebbe restituire l\'utente quando le credenziali sono valide', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
      };

      usersService.findByEmailWithPassword.mockResolvedValue(user);
      bcryptCompare.mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBe(user);
      expect(bcryptCompare).toHaveBeenCalledWith('password', user.password);
    });
  });

  describe('login', () => {
    it('dovrebbe generare un token JWT quando le credenziali sono valide', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: '$2b$10$hashedPassword',
      };

      const token = 'generated-jwt-token';

      usersService.findByEmailWithPassword.mockResolvedValue(user);
      bcryptCompare.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue(token);

      const result = await service.login('test@example.com', 'password');

      expect(result).toEqual({ access_token: token });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });

    it('dovrebbe lanciare UnauthorizedException quando le credenziali sono invalide', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);

      await expect(
        service.login('test@example.com', 'password'),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});

