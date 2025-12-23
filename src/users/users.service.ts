// Servizio applicativo per la gestione degli utenti.
// Incapsula tutta la logica di accesso al database relativa alla risorsa User.
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UniqueConstraintError } from 'sequelize';
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
  async create(dto: CreateUserDto): Promise<User> {
    try {
      // cast esplicito per adattare il DTO al tipo atteso da Sequelize
      return await this.userModel.create(dto as any);
    } catch (error) {
      // Se l'email è già presente, mappa l'eccezione di unicità su HTTP 409.
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('Esiste già un utente con questa email');
      }
      throw error;
    }
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
