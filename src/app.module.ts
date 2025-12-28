/**
 * Modulo radice dell'applicazione NestJS.
 * Qui vengono configurati il database MySQL tramite Sequelize
 * e importati i moduli funzionali (utenti, task e autenticazione).
 */
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from './config/config.module';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    /**
     * Configurazione globale di Sequelize per connettersi a MySQL.
     * Usa ConfigService per accedere alle variabili d'ambiente validate.
     * - synchronize: abilitato SOLO in sviluppo (NODE_ENV=development)
     * - logging: abilitato solo in sviluppo
     * - pool: configurazione esplicita del connection pool
     */
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: 'mysql' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME', 'todo_app'),
          autoLoadModels: true,
          // Abilita synchronize in sviluppo e test per sincronizzare lo schema automaticamente
          synchronize: ['development', 'test'].includes(
            configService.get<string>('NODE_ENV', 'development'),
          ),
          logging:
            configService.get<string>('NODE_ENV', 'development') ===
            'development',
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
