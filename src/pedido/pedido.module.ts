import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { PedidoItemEntity } from './pedido-item.entity';
import { ProdutoEntity } from '../produto/produto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PedidoEntity,
      PedidoItemEntity,
      UsuarioEntity,
      ProdutoEntity,
    ]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
