import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { AtualizaProdutoDTO } from './dto/AtualizaProduto.dto';
import { CriaProdutoDTO } from './dto/CriaProduto.dto';
import { ProdutoEntity } from './produto.entity';
import { ProdutoService } from './produto.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Controller('produtos')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post()
  async criaNovo(@Body() dadosProduto: CriaProdutoDTO) {
    const produto = new ProdutoEntity();

    const usuario = await this.usuarioService.findById(dadosProduto.usuarioId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    produto.id = randomUUID();
    produto.nome = dadosProduto.nome;
    produto.usuario = usuario;
    produto.valor = dadosProduto.valor;
    produto.quantidade = dadosProduto.quantidade;
    produto.descricao = dadosProduto.descricao;
    produto.categoria = dadosProduto.categoria;
    produto.caracteristicas = dadosProduto.caracteristicas;
    produto.imagens = dadosProduto.imagens;

    const produtoCadastrado = this.produtoService.criaProduto(produto);
    return produtoCadastrado;
  }

  @Get()
  async listaTodos() {
    return this.produtoService.listaProdutos();
  }

  @Put('/:id/:usuarioId')
  async atualiza(
    @Param('id') id: string,
    @Body() dadosProduto: AtualizaProdutoDTO,
  ) {
    const produtoAlterado = await this.produtoService.atualizaProduto(
      id,
      dadosProduto,
    );

    return {
      mensagem: 'produto atualizado com sucesso',
      produto: produtoAlterado,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const produtoRemovido = await this.produtoService.deletaProduto(id);

    return {
      mensagem: 'produto removido com sucesso',
      produto: produtoRemovido,
    };
  }
}
