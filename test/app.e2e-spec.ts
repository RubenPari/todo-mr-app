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

  it('dovrebbe permettere il flusso completo utente + task (crea, lista, cancella)', async () => {
    const server = app.getHttpServer();

    // Crea un nuovo utente
    const email = `flow-${Date.now()}@example.com`;
    const createUserRes = await request(server)
      .post('/users')
      .send({ name: 'Flusso Utente', email })
      .expect(201);

    const userId = createUserRes.body.id as number;

    // Crea un task per l'utente appena creato
    const createTaskRes = await request(server)
      .post(`/users/${userId}/tasks`)
      .send({ title: 'Primo task', description: 'Task di prova' })
      .expect(201);

    const taskId = createTaskRes.body.id as number;

    // Verifica che il task compaia nella lista dei task dell'utente
    const listTasksRes = await request(server)
      .get(`/users/${userId}/tasks`)
      .expect(200);

    expect(Array.isArray(listTasksRes.body)).toBe(true);
    expect(listTasksRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: taskId, title: 'Primo task' }),
      ]),
    );

    // Cancella il task e verifica che non sia più recuperabile
    await request(server).delete(`/tasks/${taskId}`).expect(204);
    await request(server).get(`/tasks/${taskId}`).expect(404);

    // Cancella l'utente e verifica che non sia più recuperabile
    await request(server).delete(`/users/${userId}`).expect(204);
    await request(server).get(`/users/${userId}`).expect(404);
  });
});
