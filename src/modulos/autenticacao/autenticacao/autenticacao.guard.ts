import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuarioPayload } from '../autenticacao.service';
import { JwtService } from '@nestjs/jwt';

export interface ReqComUsuario extends Request {
  usuario: UsuarioPayload;
}

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ReqComUsuario>();
    const token = this.extraiToken(request);
    if (!token) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    try {
      const payload: UsuarioPayload = await this.jwtService.verifyAsync(token);
      request.usuario = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('JWT inválido');
    }

    return true;
  }

  private extraiToken(req: Request): string | undefined {
    //formato do header authorization: "Bearer <valor_do_jwt>" -> protocolo HTTP
    const [tipo, token] = req.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}
