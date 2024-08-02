import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoEntity } from './produto.entity';
import { Repository } from 'typeorm';
import { ListaProdutoDTO } from './dto/ListaProduto.dto';
import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async criaProduto(dadosProduto: CriaProdutoDTO) {
    const produtoEntity = new ProdutoEntity();
    Object.assign(produtoEntity, dadosProduto as ProdutoEntity);

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
    Object.assign(entity, novosDados as ProdutoEntity);
    return await this.produtoRepository.save(entity);
  }

  async deletaProduto(id: string): Promise<void> {
    const result = await this.produtoRepository.delete({ id });
    if (!result.affected) {
      throw new Error('Produto não encontrado');
    }
  }
}
