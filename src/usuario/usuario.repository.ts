import { Injectable } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioRepository {
  private usuarios: UsuarioEntity[] = [];

  async salvar(usuario: UsuarioEntity) {
    this.usuarios.push(usuario);
  }

  async listarUsuarios() {
    return this.usuarios;
  }

  async buscarPorEmail(email: string) {
    const possivelUsuario = this.usuarios.find(
      (usuario) => usuario.email === email,
    );
    return possivelUsuario !== undefined;
  }

  async atualizaUsuario(
    id: string,
    dadosParaAtualizar: Partial<UsuarioEntity>,
  ) {
    const usuarioAtualizado = this.usuarios.find(
      (usuario) => usuario.id === id,
    );

    if (!usuarioAtualizado) {
      throw new Error('Usuário não encontrado');
    }

    Object.entries(dadosParaAtualizar).forEach(([chave, valor]) => {
      if (chave === 'id') {
        return;
      }

      usuarioAtualizado[chave] = valor;
    });

    return usuarioAtualizado;
  }
}
