/**
 * Test E2E per la sicurezza dei task.
 * Verifica l'isolamento delle risorse: gli utenti possono accedere solo ai propri task.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tasks Security - Resource Isolation (e2e)', () => {
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

  it('Utente A non può vedere task di utente B', async () => {
    const server = app.getHttpServer();

    // Crea utente A
    const emailA = `user-a-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User A', email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginA = await request(server)
      .post('/auth/login')
      .send({ email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenA = loginA.body.access_token as string;

    // Crea utente B
    const emailB = `user-b-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User B', email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginB = await request(server)
      .post('/auth/login')
      .send({ email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenB = loginB.body.access_token as string;

    // Utente B crea un task
    const taskB = await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Task di User B', description: 'Privato' })
      .expect(201);
    const taskBId = taskB.body.id as number;

    // Utente A prova a vedere il task di B (dovrebbe restituire 404)
    await request(server)
      .get(`/me/tasks/${taskBId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(404);
  });

  it('Utente A non può modificare task di utente B', async () => {
    const server = app.getHttpServer();

    // Crea utente A
    const emailA = `user-a-update-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User A', email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginA = await request(server)
      .post('/auth/login')
      .send({ email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenA = loginA.body.access_token as string;

    // Crea utente B
    const emailB = `user-b-update-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User B', email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginB = await request(server)
      .post('/auth/login')
      .send({ email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenB = loginB.body.access_token as string;

    // Utente B crea un task
    const taskB = await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Task di User B' })
      .expect(201);
    const taskBId = taskB.body.id as number;

    // Utente A prova a modificare il task di B (dovrebbe restituire 404)
    await request(server)
      .patch(`/me/tasks/${taskBId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Hacked!' })
      .expect(404);
  });

  it('Utente A non può eliminare task di utente B', async () => {
    const server = app.getHttpServer();

    // Crea utente A
    const emailA = `user-a-delete-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User A', email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginA = await request(server)
      .post('/auth/login')
      .send({ email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenA = loginA.body.access_token as string;

    // Crea utente B
    const emailB = `user-b-delete-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User B', email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginB = await request(server)
      .post('/auth/login')
      .send({ email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenB = loginB.body.access_token as string;

    // Utente B crea un task
    const taskB = await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Task di User B' })
      .expect(201);
    const taskBId = taskB.body.id as number;

    // Utente A prova a eliminare il task di B (dovrebbe restituire 404)
    await request(server)
      .delete(`/me/tasks/${taskBId}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(404);

    // Verifica che il task di B esista ancora
    await request(server)
      .get(`/me/tasks/${taskBId}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);
  });

  it("GET /me/tasks restituisce solo i task dell'utente autenticato", async () => {
    const server = app.getHttpServer();

    // Crea utente A
    const emailA = `user-a-list-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User A', email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginA = await request(server)
      .post('/auth/login')
      .send({ email: emailA, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenA = loginA.body.access_token as string;

    // Crea utente B
    const emailB = `user-b-list-${Date.now()}@example.com`;
    await request(server)
      .post('/auth/register')
      .send({ name: 'User B', email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(201);

    const loginB = await request(server)
      .post('/auth/login')
      .send({ email: emailB, password: 'Str0ngP@ssw0rd' })
      .expect(200);
    const tokenB = loginB.body.access_token as string;

    // Utente A crea 2 task
    const taskA1 = await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Task A1' })
      .expect(201);

    const taskA2 = await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ title: 'Task A2' })
      .expect(201);

    // Utente B crea 1 task
    await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ title: 'Task B1' })
      .expect(201);

    // Utente A vede solo i suoi 2 task
    const listA = await request(server)
      .get('/me/tasks')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    expect(listA.body).toHaveLength(2);
    expect(listA.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: taskA1.body.id }),
        expect.objectContaining({ id: taskA2.body.id }),
      ]),
    );

    // Utente B vede solo il suo 1 task
    const listB = await request(server)
      .get('/me/tasks')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    expect(listB.body).toHaveLength(1);
  });
});
