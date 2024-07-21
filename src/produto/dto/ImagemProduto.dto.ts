import { IsNotEmpty } from 'class-validator';

export class ImagemProdutoDTO {
  @IsNotEmpty({ message: 'URL é obrigatória' })
  url: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;
}
