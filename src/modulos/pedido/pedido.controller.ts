import {
  Controller,
  Post,
  Query,
  Get,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CriaPedidoDTO } from './dto/criaPedido.dto';
import { AtualizaPedidoDTO } from './dto/atulizaPedido.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { AutenticacaoGuard } from '../autenticacao/autenticacao/autenticacao.guard';

@UseGuards(AutenticacaoGuard)
@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async CriaPedido(
    @Query('usuarioId') usuarioId: string,
    @Body() dadosDoPedido: CriaPedidoDTO,
  ) {
    const pedidoCriado = await this.pedidoService.cadastraPedido(
      usuarioId,
      dadosDoPedido,
    );

    return {
      mensagem: 'Pedido feito com sucesso.',
      pedido: pedidoCriado,
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async obtemPedidosDeUsuario(@Query('usuarioId') usuarioId: string) {
    const pedidos = await this.pedidoService.obtemPedidosDeUsuario(usuarioId);

    return pedidos;
  }

  @Patch(':id')
  async atualizaPedido(
    @Param('id') pedidoId: string,
    @Body() dadosParaAtualizar: AtualizaPedidoDTO,
  ) {
    const pedidoAtualizado = await this.pedidoService.atualizaPedido(
      pedidoId,
      dadosParaAtualizar,
    );

    return pedidoAtualizado;
  }
}
