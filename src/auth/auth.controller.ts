import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './interfaces/jwt-payload.interface';

/**
 * Controller per la gestione dell'autenticazione e registrazione utenti.
 * Espone endpoint per registrazione, login e recupero del profilo utente autenticato.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  /**
   * Registra un nuovo utente nel sistema.
   * La password viene hashata automaticamente prima del salvataggio.
   *
   * @param dto - Dati dell'utente da registrare
   * @returns L'utente creato senza il campo password
   */
  @Post('register')
  @HttpCode(201)
  register(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  /**
   * Autentica un utente esistente e restituisce un token JWT.
   *
   * @param dto - Credenziali di login (email e password)
   * @returns Oggetto contenente il token JWT di accesso
   * @throws {UnauthorizedException} Se le credenziali non sono valide
   */
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  /**
   * Restituisce il profilo dell'utente attualmente autenticato.
   * Richiede un token JWT valido nell'header Authorization.
   *
   * @param user - Utente autenticato (estratto tramite @CurrentUser decorator)
   * @returns Il profilo completo dell'utente autenticato
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.users.findOne(user.userId);
  }
}
