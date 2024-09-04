import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';

import { ListaUsuariosDTO } from './dto/ListaUsuarios.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { UsuarioService } from './usuario.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { HashPassPipe } from '../../resources/pipes/hash-pass.pipe';

@Controller('/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async criaUsuario(
    @Body() { ...dadosDoUsuario }: CriaUsuarioDTO,
    @Body('senha', HashPassPipe) senhaHash: string,
  ) {
    const usuarioCriado = await this.usuarioService.criaUsuario({
      ...dadosDoUsuario,
      senha: senhaHash,
    });

    return {
      message: 'usuário criado com sucesso',
      usuario: new ListaUsuariosDTO(usuarioCriado.id, usuarioCriado.nome),
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async listaUsuarios() {
    const usuariosSalvos = await this.usuarioService.listaUsuarios();

    return usuariosSalvos;
  }

  @Put('/:id')
  async atualizaUsuario(
    @Param('id') id: string,
    @Body() dadosParaAtualizar: AtualizaUsuarioDTO,
  ) {
    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(
      id,
      dadosParaAtualizar,
    );

    return {
      usuario: usuarioAtualizado,
      mensagem: 'Usuário atualizado com sucesso',
    };
  }

  @Delete('/:id')
  async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usuarioService.deletaUsuario(id);

    return {
      usuario: usuarioRemovido,
      mensagem: 'Usuário removido com sucesso',
    };
  }
}
