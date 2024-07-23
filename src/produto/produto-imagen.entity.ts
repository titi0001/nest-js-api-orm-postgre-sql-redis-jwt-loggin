import { Entity, Column } from 'typeorm';

@Entity({ name: 'produto_imagens' })
export class ProdutoImagemProduto {
  @Column({
    name: 'url',
    length: 100,
    nullable: false,
  })
  url: string;

  @Column({
    name: 'descricao',
    length: 255,
    nullable: false,
  })
  descricao: string;
}
