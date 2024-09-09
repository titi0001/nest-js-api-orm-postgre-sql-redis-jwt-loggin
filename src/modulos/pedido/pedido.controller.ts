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
  Req,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CriaPedidoDTO } from './dto/criaPedido.dto';
import { AtualizaPedidoDTO } from './dto/atulizaPedido.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  AutenticacaoGuard,
  ReqComUsuario,
} from '../autenticacao/autenticacao/autenticacao.guard';

@UseGuards(AutenticacaoGuard)
@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async CriaPedido(
    @Req() req: ReqComUsuario,
    @Body() dadosDoPedido: CriaPedidoDTO,
  ) {
    const usuarioId = req.usuario.sub;
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
  async obtemPedidosDeUsuario(@Req() req: ReqComUsuario) {
    const usuarioId = req.usuario.sub;
    const pedidos = await this.pedidoService.obtemPedidosDeUsuario(usuarioId);

    return {
      mensagem: 'Pedidos obtidos com sucesso.',
      pedidos,
    };
  }

  @Patch(':id')
  async atualizaPedido(
    @Req() req: ReqComUsuario,
    @Param('id') pedidoId: string,
    @Body() dadosParaAtualizar: AtualizaPedidoDTO,
  ) {
    const usuarioId = req.usuario.sub;
    const pedidoAtualizado = await this.pedidoService.atualizaPedido(
      pedidoId,
      dadosParaAtualizar,
      usuarioId,
    );

    return pedidoAtualizado;
  }
}
