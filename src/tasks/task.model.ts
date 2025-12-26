/**
 * Modello Sequelize che rappresenta un task (elemento della to-do list).
 * Ogni task appartiene a un utente tramite una relazione many-to-one.
 * Quando l'utente proprietario viene eliminato, il task viene eliminato
 * automaticamente grazie alla configurazione CASCADE.
 */
import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from '../users/user.model';

@Table({ tableName: 'tasks' })
export class Task extends Model<
  InferAttributes<Task>,
  InferCreationAttributes<Task>
> {
  /**
   * Chiave primaria incrementale del task.
   * Viene generata automaticamente dal database.
   */
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  /**
   * Titolo breve del task.
   * Campo obbligatorio che descrive sinteticamente il task.
   */
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  /**
   * Descrizione testuale dettagliata del task.
   * Campo opzionale che può contenere informazioni aggiuntive.
   */
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: CreationOptional<string | null>;

  /**
   * Flag che indica se il task è stato completato.
   * Di default è impostato a false quando viene creato un nuovo task.
   */
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare completed: CreationOptional<boolean>;

  /**
   * Chiave esterna che collega il task all'utente proprietario.
   * Riferimento alla tabella 'users' tramite il campo 'id'.
   * Configurato con CASCADE per eliminare/aggiornare automaticamente
   * quando l'utente viene eliminato o aggiornato.
   */
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare userId: number;

  /**
   * Relazione many-to-one: il task appartiene a un utente.
   * Configurata con CASCADE per garantire l'integrità referenziale
   * quando l'utente viene eliminato o aggiornato.
   */
  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user?: User;
}
