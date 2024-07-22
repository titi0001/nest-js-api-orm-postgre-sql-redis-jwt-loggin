import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProdutoRepository } from './produto.repository';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';
import { v4 as uuid } from 'uuid';
import { ProdutoEntity } from './entity/produto.entity';
import { CaracteristicaProdutoEntity } from './entity/caracteristica.entity';
import { ImagemProdutoEntity } from './entity/imagem.entity';

@Controller('/produtos')
export class ProdutoController {
  constructor(private produtoRepository: ProdutoRepository) {}

  @Post()
  async criaProduto(@Body() dadosDoProduto: CriaProdutoDTO) {
    const produto = new ProdutoEntity();
    produto.id = uuid();
    produto.nome = dadosDoProduto.nome;
    produto.valor = dadosDoProduto.valor;
    produto.quantidadeDisponivel = dadosDoProduto.quantidadeDisponivel;
    produto.descricao = dadosDoProduto.descricao;

    // Mapeando caracteristicas
    produto.caracteristicas = dadosDoProduto.caracteristicas.map(
      (caracteristicaDto) => {
        const caracteristica = new CaracteristicaProdutoEntity();
        caracteristica.id = uuid(); // Gerando um novo ID para cada característica
        caracteristica.nome = caracteristicaDto.nome;
        caracteristica.descricao = caracteristicaDto.descricao;
        return caracteristica;
      },
    );

    // Mapeando imagens
    produto.imagens = dadosDoProduto.imagens.map((imagemDto) => {
      const imagem = new ImagemProdutoEntity();
      imagem.id = uuid(); // Gerando um novo ID para cada imagem
      imagem.url = imagemDto.url;
      imagem.descricao = imagemDto.descricao;
      return imagem;
    }); // Mapeando imagens

    produto.categoria = dadosDoProduto.categoria;
    produto.dataCriacao = new Date();
    produto.dataAtualizacao = new Date();

    return produto;
  }

  @Get()
  async listaProdutos() {
    return this.produtoRepository.listarProdutos();
  }
}
