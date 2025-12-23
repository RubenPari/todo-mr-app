import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth + Me Tasks (e2e)', () => {
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

  it('registro, login, profilo, CRUD su /me/tasks', async () => {
    const server = app.getHttpServer();

    const email = `auth-${Date.now()}@example.com`;
    const password = 'Str0ngP@ssw0rd';

    // registrazione
    const reg = await request(server)
      .post('/auth/register')
      .send({ name: 'Auth User', email, password })
      .expect(201);
    expect(reg.body).toEqual(expect.objectContaining({ email }));
    expect(reg.body.password).toBeUndefined();

    // login
    const login = await request(server)
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    const token = login.body.access_token as string;

    // profilo
    const me = await request(server)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const userId = me.body.id as number;

    // crea task
    const t1 = await request(server)
      .post('/me/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'T1', description: 'Desc' })
      .expect(201);

    // lista
    const list = await request(server)
      .get('/me/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBeGreaterThanOrEqual(1);

    // get by id
    const got = await request(server)
      .get(`/me/tasks/${t1.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(got.body).toEqual(
      expect.objectContaining({ id: t1.body.id, userId }),
    );

    // update
    const upd = await request(server)
      .patch(`/me/tasks/${t1.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true })
      .expect(200);
    expect(upd.body).toEqual(expect.objectContaining({ completed: true }));

    // delete
    await request(server)
      .delete(`/me/tasks/${t1.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
