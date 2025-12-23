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
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  // Crea un nuovo utente nel database.
  async create(dto: CreateUserDto): Promise<User> {
    try {
      const hashed = await bcrypt.hash(dto.password, 10);
      const created = await this.userModel.create({
        name: dto.name,
        email: dto.email,
        password: hashed,
      });
      // Ricarica con defaultScope per escludere la password dalla risposta
      return await this.findOne(created.id as number);
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

  // Ricerca utente per email includendo la password (per login)
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.scope('withPassword').findOne({ where: { email } });
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
