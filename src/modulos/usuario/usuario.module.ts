import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { EmailUnicoValidator } from './validacao/emailUnico.validator';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuarioController],
  providers: [UsuarioService, EmailUnicoValidator],
  exports: [UsuarioService],
})
export class UsuarioModule {}
