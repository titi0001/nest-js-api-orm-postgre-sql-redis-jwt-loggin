import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoEntity } from './pedido.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { PedidoItensEntity } from './pedido-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PedidoEntity, PedidoItensEntity, UsuarioEntity]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
