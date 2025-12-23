import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  // Registrazione utente (restituisce utente senza password)
  @Post('register')
  @HttpCode(201)
  register(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  // Login: restituisce JWT
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  // Profilo utente autenticato
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    // req.user viene da JwtStrategy.validate
    return this.users.findOne(req.user.userId);
  }
}
