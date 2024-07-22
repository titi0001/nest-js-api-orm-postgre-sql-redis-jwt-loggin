import { CaracteristicaProdutoEntity } from './caracteristica.entity';
import { ImagemProdutoEntity } from './imagem.entity';

export class ProdutoEntity {
  id: string;
  nome: string;
  valor: number;
  quantidadeDisponivel: number;
  descricao: string;
  caracteristicas: CaracteristicaProdutoEntity[];
  imagens: ImagemProdutoEntity[];
  categoria: string;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
