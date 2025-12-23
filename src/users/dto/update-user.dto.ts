// DTO per l'aggiornamento di un utente esistente.
// Estende CreateUserDto rendendo tutti i campi opzionali.
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
