// DTO per la creazione di un nuovo task.
// Definisce la forma dei dati accettati dall'API e le regole di validazione.
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  // Titolo breve del task.
  @ApiProperty({ example: 'Compra il latte' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  // Descrizione più estesa del task (opzionale).
  @ApiProperty({
    example: 'Ricordati di comprare il latte al supermercato',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // Stato di completamento del task (opzionale in input, default false).
  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
