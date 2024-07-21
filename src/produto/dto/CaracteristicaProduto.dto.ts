import { IsNotEmpty } from 'class-validator';

export class CaracteristicaProdutoDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;
}
