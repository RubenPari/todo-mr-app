// Test end-to-end per l'applicazione.
// Verifica flussi di registrazione/login e operazioni sui task autenticati.
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  it("POST /auth/register deve restituire 409 se l'email è duplicata", async () => {
    const email = `dup-${Date.now()}@example.com`;
    const payload = { name: 'Mario', email, password: 'Str0ngP@ssw0rd' };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(201);
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(409);
  });

  it('flusso completo autenticato: login, crea/lista/cancella task', async () => {
    const server = app.getHttpServer();

    const email = `flow-${Date.now()}@example.com`;
    const password = 'Str0ngP@ssw0rd';

    await request(server)
      .post('/auth/register')
      .send({ name: 'Flusso Utente', email, password })
      .expect(201);

    const login = await request(server)
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    const token = login.body.access_token as string;

    const createTaskRes = await request(server)
      .post(`/me/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Primo task', description: 'Task di prova' })
      .expect(201);

    const taskId = createTaskRes.body.id as number;

    const listTasksRes = await request(server)
      .get(`/me/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listTasksRes.body)).toBe(true);
    expect(listTasksRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: taskId, title: 'Primo task' }),
      ]),
    );

    await request(server)
      .delete(`/me/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    await request(server)
      .get(`/me/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
