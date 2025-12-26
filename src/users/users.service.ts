/**
 * Servizio applicativo per la gestione degli utenti.
 * Incapsula tutta la logica di accesso al database relativa alla risorsa User,
 * inclusa la gestione delle password hashate e la validazione delle operazioni CRUD.
 */
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

  /**
   * Crea un nuovo utente nel database.
   * La password viene hashata con bcrypt prima del salvataggio.
   *
   * @param dto - Dati dell'utente da creare
   * @returns L'utente creato senza il campo password (grazie al defaultScope)
   * @throws {ConflictException} Se esiste già un utente con la stessa email
   */
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
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException('Esiste già un utente con questa email');
      }
      throw error;
    }
  }

  /**
   * Restituisce la lista completa di tutti gli utenti nel database.
   *
   * @returns Array di tutti gli utenti (senza password)
   */
  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  /**
   * Restituisce un singolo utente identificato dal suo ID.
   *
   * @param id - ID numerico dell'utente da cercare
   * @returns L'utente trovato
   * @throws {NotFoundException} Se l'utente con l'ID specificato non esiste
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Ricerca un utente per email includendo il campo password.
   * Utilizzato internamente per l'autenticazione durante il login.
   *
   * @param email - Email dell'utente da cercare
   * @returns L'utente trovato con il campo password incluso, oppure null se non esiste
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userModel.scope('withPassword').findOne({ where: { email } });
  }

  /**
   * Aggiorna un utente esistente con i dati forniti.
   *
   * @param id - ID dell'utente da aggiornare
   * @param dto - Dati parziali da applicare all'utente
   * @returns L'utente aggiornato
   * @throws {NotFoundException} Se l'utente con l'ID specificato non esiste
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return user.update(dto);
  }

  /**
   * Elimina definitivamente un utente dal database.
   *
   * @param id - ID dell'utente da eliminare
   * @throws {NotFoundException} Se l'utente con l'ID specificato non esiste
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
