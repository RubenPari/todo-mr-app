/**
 * Punto di ingresso principale dell'applicazione NestJS.
 * Qui viene creata l'app, configurata la validazione globale degli input
 * e pubblicata la documentazione Swagger.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Funzione di bootstrap che avvia il server HTTP.
 * Configura la validazione globale, la documentazione Swagger e avvia il server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /**
   * Abilita un ValidationPipe globale per validare automaticamente
   * DTO e richieste in ingresso secondo le regole di class-validator.
   * - whitelist: rimuove campi non previsti dai DTO
   * - forbidNonWhitelisted: genera errore se arrivano campi non ammessi
   * - transform: converte automaticamente tipi primitivi (es. stringa -> numero)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Exception filter globale per formattare le risposte di errore.
   * Fornisce un formato consistente per tutte le eccezioni HTTP.
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Interceptor globale per il logging delle richieste HTTP.
   * Registra metodo, URL, status code e tempo di risposta.
   */
  app.useGlobalInterceptors(new LoggingInterceptor());

  /**
   * Configurazione della documentazione OpenAPI/Swagger.
   * Genera il documento OpenAPI e monta l'interfaccia Swagger UI su /api.
   */
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API per la gestione di utenti e task (to-do).')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   * Avvia il server HTTP sulla porta definita dalla variabile d'ambiente PORT
   * o sulla porta 3000 come fallback.
   */
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

/**
 * Esegue il bootstrap dell'applicazione.
 * La Promise viene intenzionalmente ignorata per evitare warning del linter.
 */
void bootstrap();
