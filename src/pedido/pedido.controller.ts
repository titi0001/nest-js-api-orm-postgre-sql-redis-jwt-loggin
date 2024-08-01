import {
  Controller,
  Post,
  Query,
  Get,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CriaPedidoDTO } from './dto/criaPedido.dto';
import { AtualizaPedidoDTO } from './dto/atulizaPedido.dto';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  CriaPedido(
    @Query('usuarioId') usuarioId: string,
    @Body() dadosDoPedido: CriaPedidoDTO,
  ) {
    const pedidoCriado = this.pedidoService.cadastraPedido(
      usuarioId,
      dadosDoPedido,
    );

    return pedidoCriado;
  }

  @Get()
  async obtemPedidosDeUsuario(@Query('usuarioId') usuarioId: string) {
    const pedidos = await this.pedidoService.obtemPedidosDeUsuario(usuarioId);

    return pedidos;
  }

  @Patch(':id')
  async atualizaPedido(
    @Param('pedidoId') pedidoId: string,
    @Body() dadosParaAtualizar: AtualizaPedidoDTO,
  ) {
    const pedidoAtualizado = await this.pedidoService.atualizaPedido(
      pedidoId,
      dadosParaAtualizar,
    );

    return pedidoAtualizado;
  }
}
