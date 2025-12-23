import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Mario Rossi' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'mario.rossi@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
