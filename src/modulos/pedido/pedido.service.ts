import {
  BadRequestException,
  ForbiddenException,
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

  private async buscaUsuario(id: string) {
    const usuario = await this.usuarioRepository.findOneBy({ id });

    if (usuario === null) {
      throw new NotFoundException('O usuário não foi encontrado');
    }

    return usuario;
  }

  private trataDadosDoPedido(
    dadosDoPedido: CriaPedidoDTO,
    produtosRelacionados: ProdutoEntity[],
  ) {
    dadosDoPedido.pedidosItem.forEach((itemPedido) => {
      const produtoRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      if (produtoRelacionado === undefined) {
        throw new NotFoundException(
          `O produto com id ${itemPedido.produtoId} não foi encontrado`,
        );
      }

      if (itemPedido.quantidade > produtoRelacionado.quantidadeDisponivel) {
        throw new BadRequestException(
          `A quantidade solicitada (${itemPedido.quantidade}) é maior que a quantidade disponível (${produtoRelacionado.quantidadeDisponivel}) do produto ${produtoRelacionado.nome}`,
        );
      }
    });
  }

  async cadastraPedido(usuarioId: string, dadosDoPedido: CriaPedidoDTO) {
    const usuario = await this.buscaUsuario(usuarioId);

    const produtosIds = dadosDoPedido.pedidosItem.map(
      (itemPedido) => itemPedido.produtoId,
    );
    const produtosRelacionados = await this.produtoRepository.findBy({
      id: In(produtosIds),
    });
    const pedidoEntity = new PedidoEntity();

    this.trataDadosDoPedido(dadosDoPedido, produtosRelacionados);

    pedidoEntity.status = StatusPedido.EM_PROCESSAMENTO;
    pedidoEntity.usuario = usuario;

    const pedidosItensEntity = dadosDoPedido.pedidosItem.map((itemPedido) => {
      const produtosRelacionado = produtosRelacionados.find(
        (produto) => produto.id === itemPedido.produtoId,
      );

      const pedidoItemEntity = new PedidoItemEntity();
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
    const usuario = await this.pedidoRepository.find({
      where: { usuario: { id: usuarioId } },
    });

    if (usuario === null) {
      throw new NotFoundException('O usuario não foi encontrado');
    }

    return this.pedidoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: {
        usuario: true,
      },
    });
  }

  async atualizaPedido(
    id: string,
    atualizaPedidoDTO: AtualizaPedidoDTO,
    usuarioId: string,
  ) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id },
      relations: { usuario: true },
    });

    if (pedido === null) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (pedido.usuario.id !== usuarioId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar este pedido',
      );
    }

    Object.assign(pedido, atualizaPedidoDTO as PedidoEntity);

    return this.pedidoRepository.save(pedido);
  }
}
