// DTO per l'aggiornamento di un task esistente.
// Estende CreateTaskDto rendendo tutti i campi opzionali.
import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
