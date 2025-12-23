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
});
