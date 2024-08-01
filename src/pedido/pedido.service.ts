import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { In, Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { StatusPedido } from './enum/statusPedido.enum';
import { CriaPedidoDTO } from './dto/criaPedido.dto';
import { PedidoItemEntity } from './pedido-item.entity';
import { ProdutoEntity } from '../produto/produto.entity';
import { AtualizaPedidoDTO } from './dto/atulizaPedido.dto';

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

  private trataDadosDoPedido(
    dadosDoPedido: CriaPedidoDTO,
    produtosRelacionados: ProdutoEntity[],
  ) {
    dadosDoPedido.pedidosItem.forEach((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );
      if (produtoRelacionado === undefined) {
        throw new NotFoundException('Produto não encontrado');
      }
      if (itemPedido.quantidade > produtoRelacionado.quantidadeDisponivel) {
        throw new BadRequestException(
          `A quantidade solicitada (${itemPedido.quantidade}) é maior que a quantidade disponível (${produtoRelacionado.quantidadeDisponivel}) do produto ${produtoRelacionado.nome}`,
        );
      }
    });
  }

  async cadastraPedido(usuarioId: string, dadosDoPedido: CriaPedidoDTO) {
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    if (usuario === undefined) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const produtosIds = dadosDoPedido.pedidosItem.map(
      (itemPedido) => itemPedido.produtoId,
    );
    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosIds),
    });

    this.trataDadosDoPedido(dadosDoPedido, produtosRelacionados);

    const pedidoEntity = new PedidoEntity();
    pedidoEntity.status = StatusPedido.EM_PROCESSAMENTO;

    const pedidosItensEntity = dadosDoPedido.pedidosItem.map((itemPedido) => {
      const pedidoItemEntity = new PedidoItemEntity();
      const produtosRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );
      pedidoItemEntity.produto = produtosRelacionado!;
      pedidoItemEntity.precoVenda = produtosRelacionado!.valor;
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

  async atualizaPedido(id: string, atualizaPedidoDTO: AtualizaPedidoDTO) {
    const pedido = await this.pedidoRepository.findOneBy({ id });

    if (pedido === null) {
      throw new NotFoundException('Pedido não encontrado');
    }

    Object.assign(pedido, atualizaPedidoDTO);

    return this.pedidoRepository.save(pedido);
  }
}
