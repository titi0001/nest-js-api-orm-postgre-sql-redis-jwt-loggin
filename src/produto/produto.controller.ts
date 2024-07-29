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
    const produtoCadastrado = new this.produtoService.criaProduto(dadosProduto);

    // const usuario = await this.usuarioService.findById(dadosProduto.usuarioId);
    // if (!usuario) {
    //   throw new Error('Usuário não encontrado');
    // }
    return {
      mensagem: 'Produto criado com sucesso',
      produto: produtoCadastrado,
    };
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
