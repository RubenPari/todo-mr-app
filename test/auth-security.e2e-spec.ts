/**
 * Test E2E per la sicurezza dell'autenticazione.
 * Verifica errori di autenticazione, token invalidi e accesso non autorizzato.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Auth Security (e2e)', () => {
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

  it('POST /auth/login deve restituire 401 con password sbagliata', async () => {
    const server = app.getHttpServer();
    const email = `wrong-pwd-${Date.now()}@example.com`;
    const password = 'Str0ngP@ssw0rd';

    // Registra utente
    await request(server)
      .post('/auth/register')
      .send({ name: 'User', email, password })
      .expect(201);

    // Prova login con password sbagliata
    await request(server)
      .post('/auth/login')
      .send({ email, password: 'WrongPassword123' })
      .expect(401);
  });

  it('POST /auth/login deve restituire 401 con email inesistente', async () => {
    const server = app.getHttpServer();

    await request(server)
      .post('/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'AnyPassword123' })
      .expect(401);
  });

  it('GET /auth/me deve restituire 401 senza token', async () => {
    const server = app.getHttpServer();

    await request(server).get('/auth/me').expect(401);
  });

  it('GET /auth/me deve restituire 401 con token invalido', async () => {
    const server = app.getHttpServer();

    await request(server)
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token-here')
      .expect(401);
  });

  it('GET /auth/me deve restituire 401 con token malformato', async () => {
    const server = app.getHttpServer();

    await request(server)
      .get('/auth/me')
      .set('Authorization', 'InvalidFormat')
      .expect(401);
  });

  it('POST /auth/login deve validare i campi obbligatori', async () => {
    const server = app.getHttpServer();

    // Email mancante
    await request(server)
      .post('/auth/login')
      .send({ password: 'Str0ngP@ssw0rd' })
      .expect(400);

    // Password mancante
    await request(server)
      .post('/auth/login')
      .send({ email: 'test@example.com' })
      .expect(400);

    // Email invalida
    await request(server)
      .post('/auth/login')
      .send({ email: 'not-an-email', password: 'Str0ngP@ssw0rd' })
      .expect(400);
  });

  it('POST /auth/register deve validare i campi obbligatori', async () => {
    const server = app.getHttpServer();

    // Email mancante
    await request(server)
      .post('/auth/register')
      .send({ name: 'User', password: 'Str0ngP@ssw0rd' })
      .expect(400);

    // Password troppo corta
    await request(server)
      .post('/auth/register')
      .send({ name: 'User', email: 'test@example.com', password: 'short' })
      .expect(400);

    // Email invalida
    await request(server)
      .post('/auth/register')
      .send({
        name: 'User',
        email: 'not-an-email',
        password: 'Str0ngP@ssw0rd',
      })
      .expect(400);
  });
});
