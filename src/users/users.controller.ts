// Controller HTTP per la risorsa "User".
// Espone endpoint REST per creare, leggere, aggiornare ed eliminare utenti.
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

// Tag Swagger per raggruppare tutti gli endpoint degli utenti.
@ApiTags('users')
// Prefisso di routing: tutti gli endpoint iniziano con /users.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Crea un nuovo utente.
  @Post()
  @ApiCreatedResponse({ type: User })
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  // Restituisce la lista completa degli utenti.
  @Get()
  @ApiOkResponse({ type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Restituisce un singolo utente per id.
  @Get(':id')
  @ApiOkResponse({ type: User })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  // Aggiorna un utente esistente.
  @Patch(':id')
  @ApiOkResponse({ type: User })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, dto);
  }

  // Elimina un utente.
  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
