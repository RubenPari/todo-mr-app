// Servizio applicativo per la gestione degli utenti.
// Incapsula tutta la logica di accesso al database relativa alla risorsa User.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  // Il model Sequelize viene iniettato tramite InjectModel.
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  // Crea un nuovo utente a partire dai dati validati del DTO.
  create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  // Restituisce la lista completa degli utenti.
  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  // Restituisce un singolo utente per id oppure lancia NotFoundException.
  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  // Aggiorna un utente esistente con i dati forniti nel DTO di update.
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return user.update(dto);
  }

  // Elimina definitivamente un utente dal database.
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
