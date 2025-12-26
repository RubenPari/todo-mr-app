/**
 * Data Transfer Object per la creazione di un nuovo task.
 * Definisce la forma dei dati accettati dall'API e le regole di validazione.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  /**
   * Titolo breve del task.
   * Deve essere una stringa non vuota.
   */
  @ApiProperty({ example: 'Compra il latte' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  /**
   * Descrizione più estesa del task.
   * Campo opzionale che può essere omesso nella richiesta.
   */
  @ApiProperty({
    example: 'Ricordati di comprare il latte al supermercato',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  /**
   * Stato di completamento del task.
   * Campo opzionale che di default viene impostato a false se non specificato.
   */
  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
