/**
 * Guard per verificare che un task appartenga all'utente autenticato.
 * Elimina la duplicazione della logica di verifica della proprietà del task.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from '../tasks.service';
import { AuthenticatedUser } from '../../auth/interfaces/jwt-payload.interface';

@Injectable()
export class TaskOwnershipGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const taskId = parseInt(request.params.id, 10);
    const user: AuthenticatedUser = request.user;

    const task = await this.tasksService.findOne(taskId);
    if (task.userId !== user.userId) {
      throw new NotFoundException('Task not found');
    }

    // Attach task alla richiesta per evitare query duplicate nei controller
    request.task = task;
    return true;
  }
}

