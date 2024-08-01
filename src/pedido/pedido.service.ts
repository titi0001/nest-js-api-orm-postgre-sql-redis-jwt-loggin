import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { In, Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { StatusPedido } from './enum/statusPedido.enum';
import { CriaPedidoDTO } from './dto/criaPedido.dto';
import { PedidoItemEntity } from './pedido-item.entity';
import { ProdutoEntity } from '../produto/produto.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(PedidoEntity)
    private readonly pedidoRepository: Repository<PedidoEntity>,
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    @InjectRepository(ProdutoEntity)
    private readonly produtoRepository: Repository<ProdutoEntity>,
  ) {}

  async cadastraPedido(usuarioId: string, dadosDoPedido: CriaPedidoDTO) {
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    const produtosIds = dadosDoPedido.pedidosItem.map(
      (itemPedido) => itemPedido.produtoId,
    );

    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosIds),
    });

    const pedidoEntity = new PedidoEntity();
    pedidoEntity.status = StatusPedido.EM_PROCESSAMENTO;
    pedidoEntity.usuario = usuario;

    const pedidosItensEntity = dadosDoPedido.pedidosItem.map((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );
      const pedidoItemEntity = new PedidoItemEntity();
      pedidoItemEntity.produto = produtoRelacionado;
      pedidoItemEntity.precoVenda = produtoRelacionado.valor;
      pedidoItemEntity.quantidade = itemPedido.quantidade;
      pedidoItemEntity.produto.quantidadeDisponivel -= itemPedido.quantidade;
      return pedidoItemEntity;
    });

    const valorTotal = pedidosItensEntity.reduce((total, item) => {
      return total + item.precoVenda * item.quantidade;
    }, 0);

    pedidoEntity.valorTotal = valorTotal;
    pedidoEntity.pedidoItens = pedidosItensEntity;

    const pedidoCriado = await this.pedidoRepository.save(pedidoEntity);
    return pedidoCriado;
  }

  async obtemPedidosDeUsuario(usuarioId: string) {
    const pedidos = await this.pedidoRepository.find({
      where: { usuario: { id: usuarioId } },
    });

    return pedidos;
  }
}
