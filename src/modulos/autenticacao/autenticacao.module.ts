import { Module } from '@nestjs/common';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoController } from './autenticacao.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuarioModule,
    JwtModule.register({
      global: true,
      secret: 'SECRET_KEY',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService],
})
export class AutenticacaoModule {}
