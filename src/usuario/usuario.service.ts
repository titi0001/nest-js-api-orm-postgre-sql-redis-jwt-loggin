import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { ListaUsuariosDTO } from './dto/ListaUsuarios.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async criaUsuario(usuarioEntity: CriaUsuarioDTO) {
    const usuario = new UsuarioEntity();
    Object.assign(usuario, usuarioEntity as UsuarioEntity);

    return await this.usuarioRepository.save(usuario);
  }

  async listaUsuarios() {
    const usuariosSalvos = await this.usuarioRepository.find();
    const usuariosLista = usuariosSalvos.map(
      (usuario) => new ListaUsuariosDTO(usuario.id, usuario.nome),
    );
    return usuariosLista;
  }

  async buscaUsuarioPorEmail(email: string) {
    const checkEmail = await this.usuarioRepository.findOne({
      where: { email },
    });

    if (checkEmail === null) {
      throw new NotFoundException('O email não foi encontrado');
    }

    return checkEmail;
  }

  async atualizaUsuario(id: string, novosDados: AtualizaUsuarioDTO) {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (usuario == null) {
      throw new NotFoundException('Usuário não encontrado');
    }

    Object.assign(usuario, novosDados as UsuarioEntity);

    return await this.usuarioRepository.save(usuario);
  }

  async deletaUsuario(id: string) {
    const deleteUsuario = await this.usuarioRepository.delete(id);

    if (!deleteUsuario.affected) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
