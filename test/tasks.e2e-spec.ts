import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tasks CRUD (e2e)', () => {
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
    if (app) {
      await app.close();
    }
  });

  it('crea, legge, aggiorna e cancella un task', async () => {
    const server = app.getHttpServer();

    const email = `tasks-crud-${Date.now()}@example.com`;
    const createUserRes = await request(server)
      .post('/users')
      .send({ name: 'User CRUD', email })
      .expect(201);
    const userId = createUserRes.body.id as number;

    const createTaskRes = await request(server)
      .post(`/users/${userId}/tasks`)
      .send({ title: 'Titolo iniziale', description: 'Desc iniziale' })
      .expect(201);

    const taskId = createTaskRes.body.id as number;

    // GET by id
    const getTaskRes = await request(server).get(`/tasks/${taskId}`).expect(200);
    expect(getTaskRes.body).toEqual(
      expect.objectContaining({ id: taskId, title: 'Titolo iniziale', description: 'Desc iniziale', completed: false, userId }),
    );

    // PATCH update
    const updateRes = await request(server)
      .patch(`/tasks/${taskId}`)
      .send({ title: 'Titolo aggiornato', completed: true })
      .expect(200);
    expect(updateRes.body).toEqual(
      expect.objectContaining({ id: taskId, title: 'Titolo aggiornato', completed: true }),
    );

    // DELETE task
    await request(server).delete(`/tasks/${taskId}`).expect(204);
    await request(server).get(`/tasks/${taskId}`).expect(404);

    // cleanup user
    await request(server).delete(`/users/${userId}`).expect(204);
  });

  it('POST con campi extra deve restituire 400 (ValidationPipe)', async () => {
    const server = app.getHttpServer();

    const email = `tasks-validate-${Date.now()}@example.com`;
    const { body } = await request(server)
      .post('/users')
      .send({ name: 'User Validate', email })
      .expect(201);

    const userId = body.id as number;

    await request(server)
      .post(`/users/${userId}/tasks`)
      .send({ title: 'Task', foo: 'bar' }) // campo non whitelisted
      .expect(400);

    await request(server).delete(`/users/${userId}`).expect(204);
  });

  it('GET lista task utente contiene i task creati', async () => {
    const server = app.getHttpServer();

    const email = `tasks-list-${Date.now()}@example.com`;
    const createUserRes = await request(server)
      .post('/users')
      .send({ name: 'User List', email })
      .expect(201);
    const userId = createUserRes.body.id as number;

    const t1 = await request(server)
      .post(`/users/${userId}/tasks`)
      .send({ title: 'T1' })
      .expect(201);
    const t2 = await request(server)
      .post(`/users/${userId}/tasks`)
      .send({ title: 'T2', description: 'Secondo' })
      .expect(201);

    const listRes = await request(server).get(`/users/${userId}/tasks`).expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: t1.body.id, title: 'T1', userId }),
        expect.objectContaining({ id: t2.body.id, title: 'T2', userId }),
      ]),
    );

    // cleanup
    await request(server).delete(`/tasks/${t1.body.id}`).expect(204);
    await request(server).delete(`/tasks/${t2.body.id}`).expect(204);
    await request(server).delete(`/users/${userId}`).expect(204);
  });

  it('PATCH /tasks/:id su task inesistente deve restituire 404', async () => {
    const server = app.getHttpServer();
    await request(server).patch('/tasks/999999999').send({ title: 'X' }).expect(404);
  });

  it('DELETE /tasks/:id su task inesistente deve restituire 404', async () => {
    const server = app.getHttpServer();
    await request(server).delete('/tasks/999999999').expect(404);
  });
});
