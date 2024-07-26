import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import { Repository } from 'typeorm';
import { ListaProdutoDTO } from './dto/ListaProduto.dto';
import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async criaProduto(produtoEntity: ProdutoEntity): Promise<ProdutoEntity> {
    return await this.produtoRepository.save(produtoEntity);
  }

  async listaProdutos(): Promise<ListaProdutoDTO[]> {
    const produtosSalvos = await this.produtoRepository.find();
    return produtosSalvos.map(
      (produto) => new ListaProdutoDTO(produto.id, produto.nome),
    );
  }

  async atualizaProduto(
    id: string,
    novosDados: AtualizaProdutoDTO,
  ): Promise<ProdutoEntity> {
    const entity = await this.produtoRepository.findOneBy({ id });
    if (!entity) {
      throw new Error('Produto não encontrado');
    }
    Object.assign(entity, novosDados);
    return await this.produtoRepository.save(entity);
  }

  async deletaProduto(id: string): Promise<void> {
    const result = await this.produtoRepository.delete({ id });
    if (result.affected === 0) {
      throw new Error('Produto não encontrado');
    }
  }
}
