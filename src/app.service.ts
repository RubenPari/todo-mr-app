// Servizio di esempio utilizzato dal controller root.
// Al momento contiene solo logica minimale per restituire una stringa statica.
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Restituisce il messaggio usato come risposta dell'endpoint GET "/".
  getHello(): string {
    return 'Hello World!';
  }
}
