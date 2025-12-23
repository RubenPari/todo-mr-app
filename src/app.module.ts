// Modulo radice dell'applicazione NestJS.
// Qui vengono configurati il database MySQL tramite Sequelize
// e importati i moduli funzionali (utenti e task).
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    // Configurazione globale di Sequelize per connettersi a MySQL.
    SequelizeModule.forRoot({
      dialect: 'mysql',
      // Parametri di connessione letti da variabili d'ambiente con fallback.
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'todo_app',
      // Carica automaticamente tutti i modelli registrati nei moduli.
      autoLoadModels: true,
      // Sincronizza automaticamente lo schema del DB con i modelli (solo per sviluppo).
      synchronize: true,
      // Disabilita il logging SQL dettagliato in console.
      logging: false,
    }),
    // Modulo per la gestione degli utenti.
    UsersModule,
    // Modulo per la gestione dei task.
    TasksModule,
  ],
  // Controller a livello di applicazione (es. endpoint root "/").
  controllers: [AppController],
  // Provider condivisi a livello di applicazione.
  providers: [AppService],
})
export class AppModule {}
