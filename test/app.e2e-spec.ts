// Test end-to-end per l'applicazione.
// Avviano un'istanza reale di Nest e verificano che l'endpoint root
// risponda correttamente tramite una richiesta HTTP.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  // Prima di ogni test viene creato un modulo Nest completo con AppModule.
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Crea e inizializza l'applicazione Nest effettiva.
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    // Esegue una richiesta HTTP GET alla root e verifica status e payload.
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('POST /users deve restituire 409 se l\'email è duplicata', async () => {
    const email = `dup-${Date.now()}@example.com`;
    const payload = { name: 'Mario', email };

    // Prima creazione deve andare a buon fine.
    await request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(201);

    // Seconda creazione con la stessa email deve restituire 409.
    await request(app.getHttpServer())
      .post('/users')
      .send(payload)
      .expect(409);
  });

  it('POST /users/:id/tasks deve restituire 404 se l\'utente non esiste', async () => {
    const nonExistingUserId = 999999;

    await request(app.getHttpServer())
      .post(`/users/${nonExistingUserId}/tasks`)
      .send({ title: 'Task per utente inesistente' })
      .expect(404);
  });
});
