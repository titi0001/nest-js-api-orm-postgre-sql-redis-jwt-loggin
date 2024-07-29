import { ProdutoEntity } from 'src/produto/produto.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'usuarios' })
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome',
    length: 100,
    nullable: false,
  })
  nome: string;

  @Column({
    name: 'email',
    length: 70,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'senha',
    length: 255,
    nullable: false,
  })
  senha: string;

  @OneToMany(() => ProdutoEntity, (produto) => produto.usuario)
  produtos: ProdutoEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
