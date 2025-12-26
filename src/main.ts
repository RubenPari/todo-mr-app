/**
 * Punto di ingresso principale dell'applicazione NestJS.
 * Qui viene creata l'app, configurata la validazione globale degli input
 * e pubblicata la documentazione Swagger.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Funzione di bootstrap che avvia il server HTTP.
 * Configura la validazione globale, la documentazione Swagger e avvia il server.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
   * Configurazione della documentazione OpenAPI/Swagger.
   * Genera il documento OpenAPI e monta l'interfaccia Swagger UI su /api.
   */
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API per la gestione di utenti e task (to-do).')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /**
   * Avvia il server HTTP sulla porta definita dalla variabile d'ambiente PORT
   * o sulla porta 3000 come fallback.
   */
  await app.listen(process.env.PORT ?? 3000);
}

/**
 * Esegue il bootstrap dell'applicazione.
 * La Promise viene intenzionalmente ignorata per evitare warning del linter.
 */
void bootstrap();
