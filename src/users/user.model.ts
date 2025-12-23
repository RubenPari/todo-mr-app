// Modello Sequelize che rappresenta un utente dell'applicazione.
// Ogni utente può avere più task associati.
import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import { Task } from '../tasks/task.model';

// Definisce la tabella "users" nel database.
@Table({ tableName: 'users' })
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // Chiave primaria incrementale dell'utente.
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  // Nome completo dell'utente.
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  // Indirizzo email univoco dell'utente.
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  // Relazione: un utente possiede molti task.
  // onDelete: 'CASCADE' fa sì che, eliminando un utente, vengano eliminati
  // automaticamente anche tutti i task associati.
  @HasMany(() => Task, { onDelete: 'CASCADE', hooks: true })
  declare tasks?: NonAttribute<Task[]>;
}
