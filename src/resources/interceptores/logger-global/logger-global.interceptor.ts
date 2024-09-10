import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { ReqComUsuario } from '../../../../src/modulos/autenticacao/autenticacao/autenticacao.guard';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextHttp = context.switchToHttp();
    const request = contextHttp.getRequest<Request | ReqComUsuario>();

    return next.handle().pipe(
      tap(() => {
        if ('usuario' in request) {
          this.logger.log(`Rota acessada pelo usuario ${request.usuario.sub}`);
        }
      }),
    );
  }
}
