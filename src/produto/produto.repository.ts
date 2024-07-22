import { Injectable } from '@nestjs/common';
import { ProdutoEntity } from './entity/produto.entity';

@Injectable()
export class ProdutoRepository {
  private produtos: ProdutoEntity[] = [];

  async salvar(produto) {
    this.produtos.push(produto);
  }

  async buscarProdutoPorId(id) {
    const produto = this.produtos.find((produto) => produto.id === id);

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return produto;
  }

  async listarProdutos() {
    return this.produtos;
  }

  async atualizaProduto(id, dadosParaAtualizar) {
    const produto = await this.buscarProdutoPorId(id);

    Object.entries(dadosParaAtualizar).forEach(([chave, valor]) => {
      if (chave === 'id') {
        return;
      }

      produto[chave] = valor;
    });

    return produto;
  }

  async deletaProduto(id) {
    const produto = await this.buscarProdutoPorId(id);

    return this.produtos.splice(this.produtos.indexOf(produto), 1);
  }
}
