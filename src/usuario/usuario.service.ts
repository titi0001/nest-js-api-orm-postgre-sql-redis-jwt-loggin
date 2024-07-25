import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { ListaUsuariosDTO } from './dto/ListaUsuarios.dto';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async findById(id: string): Promise<UsuarioEntity> {
    return await this.usuarioRepository.findOne({ where: { id } });
  }

  async listaUsuarios() {
    const usuariosSalvos = await this.usuarioRepository.find();
    const usuariosLista = usuariosSalvos.map(
      (usuario) => new ListaUsuariosDTO(usuario.id, usuario.nome),
    );
    return usuariosLista;
  }

  async criaUsuario(usuarioEntity: UsuarioEntity) {
    return await this.usuarioRepository.save(usuarioEntity);
  }

  async atualizaUsuario(id: string, usuarioEntity: AtualizaUsuarioDTO) {
    await this.usuarioRepository.update(id, usuarioEntity);
  }

  async deletaUsuario(id: string) {
    await this.usuarioRepository.delete(id);
  }
}
