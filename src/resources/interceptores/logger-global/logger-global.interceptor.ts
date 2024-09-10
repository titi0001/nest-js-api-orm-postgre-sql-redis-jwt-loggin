import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { ReqComUsuario } from '../../../../src/modulos/autenticacao/autenticacao/autenticacao.guard';

@Injectable()
export class LoggerGlobalInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextHttp = context.switchToHttp();

    const request = contextHttp.getRequest<Request | ReqComUsuario>();

    const res = contextHttp.getResponse<Response>();

    const { path, method } = request;
    const { statusCode } = res;

    this.logger.log(`Rota acessada: ${method} ${path}`);

    const instanteInicial = Date.now();

    return next.handle().pipe(
      tap(() => {
        if ('usuario' in request) {
          this.logger.log(`Rota acessada pelo usuario ${request.usuario.sub}`);
        }
        const tempoDeExecucao = Date.now() - instanteInicial;
        this.logger.log(
          `Resposta: status ${statusCode} -Tempo de execução: ${tempoDeExecucao}ms`,
        );
      }),
    );
  }
}
