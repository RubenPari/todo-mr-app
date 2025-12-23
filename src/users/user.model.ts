import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { Task } from '../tasks/task.model';

@Table({ tableName: 'users' })
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @HasMany(() => Task)
  tasks?: Task[];
}
