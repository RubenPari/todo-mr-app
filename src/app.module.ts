/**
 * Modulo radice dell'applicazione NestJS.
 * Qui vengono configurati il database MySQL tramite Sequelize
 * e importati i moduli funzionali (utenti, task e autenticazione).
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    /**
     * Configurazione globale di Sequelize per connettersi a MySQL.
     * I parametri di connessione vengono letti da variabili d'ambiente con valori di fallback.
     * - autoLoadModels: carica automaticamente tutti i modelli registrati nei moduli
     * - synchronize: sincronizza automaticamente lo schema del DB con i modelli (solo per sviluppo)
     * - logging: disabilita il logging SQL dettagliato in console
     */
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'todo_app',
      autoLoadModels: true,
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
