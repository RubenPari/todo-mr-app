// Modello Sequelize che rappresenta un task (elemento della to-do list).
// Ogni task appartiene a un utente.
import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

// Definisce la tabella "tasks" nel database.
@Table({ tableName: 'tasks' })
export class Task extends Model<Task> {
  // Chiave primaria incrementale del task.
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  // Titolo breve del task.
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  // Descrizione testuale dettagliata (opzionale).
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string | null;

  // Flag che indica se il task è stato completato.
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  completed!: boolean;

  // Chiave esterna che collega il task all'utente proprietario.
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  userId!: number;

  // Relazione di appartenenza: il task appartiene a un utente.
  // onDelete/onUpdate a livello di associazione garantiscono che la FK
  // venga aggiornata/cancellata correttamente quando cambia l'utente.
  @BelongsTo(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user?: User;
}
