// Punto di ingresso principale dell'applicazione NestJS.
// Qui viene creata l'app, configurata la validazione globale degli input
// e pubblicata la documentazione Swagger.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Funzione di bootstrap che avvia il server HTTP.
async function bootstrap() {
  // Crea un'applicazione Nest partendo dal modulo radice.
  const app = await NestFactory.create(AppModule);

  // Abilita un ValidationPipe globale per validare automaticamente
  // DTO e richieste in ingresso secondo le regole di class-validator.
  app.useGlobalPipes(
    new ValidationPipe({
      // Rimuove campi non previsti dai DTO.
      whitelist: true,
      // Genera errore se arrivano campi non ammessi.
      forbidNonWhitelisted: true,
      // Converte automaticamente tipi primitivi (es. stringa -> numero).
      transform: true,
    }),
  );

  // Configurazione della documentazione OpenAPI/Swagger.
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API per la gestione di utenti e task (to-do).')
    .setVersion('1.0')
    .build();

  // Genera il documento OpenAPI e monta l'interfaccia Swagger UI su /api.
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Avvia il server HTTP sulla porta definita dalla variabile d'ambiente PORT o 3000.
  await app.listen(process.env.PORT ?? 3000);
}

// Esegue il bootstrap dell'applicazione (ignorando intenzionalmente la Promise per il linter).
void bootstrap();
