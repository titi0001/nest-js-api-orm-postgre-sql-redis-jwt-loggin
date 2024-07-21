import { Injectable } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity';

@Injectable()
export class UsuarioRepository {
  private usuarios: UsuarioEntity[] = [];

  async salvar(usuario: UsuarioEntity) {
    this.usuarios.push(usuario);
  }

  private async buscarUsuarioPorId(id: string) {
    const usuario = this.usuarios.find((usuario) => usuario.id === id);

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
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
    const usuario = await this.buscarUsuarioPorId(id);

    Object.entries(dadosParaAtualizar).forEach(([chave, valor]) => {
      if (chave === 'id') {
        return;
      }

      usuario[chave] = valor;
    });

    return usuario;
  }

  async deletaUsuario(id: string) {
    const usuario = await this.buscarUsuarioPorId(id);

    return this.usuarios.splice(this.usuarios.indexOf(usuario), 1);
  }
}
