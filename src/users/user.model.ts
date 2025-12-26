/**
 * Modello Sequelize che rappresenta un utente dell'applicazione.
 * Ogni utente può avere più task associati tramite una relazione one-to-many.
 * 
 * Il modello utilizza uno scope di default che esclude il campo password
 * dalle query standard per motivi di sicurezza. Per includere la password
 * è necessario utilizzare esplicitamente lo scope 'withPassword'.
 */
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

@Table({
  tableName: 'users',
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  /**
   * Chiave primaria incrementale dell'utente.
   * Viene generata automaticamente dal database.
   */
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  /**
   * Nome completo dell'utente.
   * Campo obbligatorio.
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  /**
   * Indirizzo email univoco dell'utente.
   * Deve essere univoco nel database e viene utilizzato per l'autenticazione.
   */
  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  /**
   * Password dell'utente hashata con bcrypt.
   * Esclusa dallo scope di default per motivi di sicurezza.
   * Per includerla nelle query, utilizzare lo scope 'withPassword'.
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  /**
   * Relazione one-to-many: un utente possiede molti task.
   * Quando un utente viene eliminato, tutti i task associati vengono
   * eliminati automaticamente grazie alla configurazione CASCADE.
   */
  @HasMany(() => Task, { onDelete: 'CASCADE', hooks: true })
  declare tasks?: NonAttribute<Task[]>;
}
