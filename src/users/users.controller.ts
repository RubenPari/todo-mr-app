/**
 * Controller HTTP per la risorsa "User".
 * Espone endpoint REST per creare, leggere, aggiornare ed eliminare utenti.
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crea un nuovo utente nel sistema.
   *
   * @param dto - Dati dell'utente da creare
   * @returns L'utente creato (senza password)
   */
  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  /**
   * Restituisce la lista completa di tutti gli utenti.
   *
   * @returns Array di tutti gli utenti registrati
   */
  @Get()
  @ApiOkResponse({ type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  /**
   * Restituisce un singolo utente identificato dal suo ID.
   *
   * @param id - ID numerico dell'utente
   * @returns L'utente trovato
   * @throws {NotFoundException} Se l'utente non esiste
   */
  @Get(':id')
  @ApiOkResponse({ type: User })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  /**
   * Aggiorna un utente esistente con i dati forniti.
   *
   * @param id - ID dell'utente da aggiornare
   * @param dto - Dati parziali da applicare all'utente
   * @returns L'utente aggiornato
   * @throws {NotFoundException} Se l'utente non esiste
   */
  @Patch(':id')
  @ApiOkResponse({ type: User })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, dto);
  }

  /**
   * Elimina definitivamente un utente dal sistema.
   *
   * @param id - ID dell'utente da eliminare
   * @throws {NotFoundException} Se l'utente non esiste
   */
  @Delete(':id')
  @HttpCode(204)
  @ApiOkResponse({ description: 'User deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
