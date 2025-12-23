// Test unitari per AppController.
// Verificano che l'endpoint root restituisca la stringa attesa.
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  // Prima di ogni test viene creato un modulo di testing Nest con controller e service reali.
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    // Recupera un'istanza di AppController dal container di testing.
    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // Verifica che il metodo getHello restituisca il messaggio predefinito.
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
