import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StatusPedido } from './enum/statusPedido.enum';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { PedidoItemEntity } from './pedido-item.entity';

@Entity({ name: 'pedidos' })
export class PedidoEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'valor_total',
    nullable: false,
  })
  valorTotal: number;

  @Column({
    name: 'status',
    enum: StatusPedido,
    nullable: false,
  })
  status: StatusPedido;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.pedidos)
  usuario: UsuarioEntity;

  @OneToMany(() => PedidoItemEntity, (itemPedido) => itemPedido.pedido, {
    cascade: true,
  })
  pedidoItens: PedidoItemEntity[];
}
