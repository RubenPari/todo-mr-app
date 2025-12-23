// Controller principale dell'applicazione.
// Espone l'endpoint root ("/") usato anche dai test come healthcheck semplice.
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

// Tag utilizzato da Swagger per raggruppare gli endpoint di questo controller.
@ApiTags('root')
@Controller()
export class AppController {
  // AppService viene iniettato per delegare la logica di business.
  constructor(private readonly appService: AppService) {}

  // Gestisce la richiesta GET sulla root "/" e restituisce una stringa di benvenuto.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
