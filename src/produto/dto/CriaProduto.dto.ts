import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CaracteristicaProdutoDTO } from './CaracteristicaProduto.dto';
import { ImagemProdutoDTO } from './ImagemProduto.dto';

export class CriaProdutoDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsPositive({ message: 'O valor do produto deve ser um número positivo.' })
  @IsDecimal({
    decimal_digits: '1,2',
    force_decimal: true,
  })
  valor: number;

  @IsNumber({}, { message: 'A quantidade deve ser um número.' })
  @Min(0, {
    message: 'A quantidade deve ser um número igual ou maior que zero.',
  })
  quantidadeDisponivel: number;

  @IsString({ message: 'A descrição deve ser uma string.' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
  @MaxLength(1000, {
    message: 'A descrição não pode ter mais de 1000 caracteres.',
  })
  descricao: string;

  @ValidateNested({ each: true })
  @IsArray({ message: 'A lista de características deve ser um array.' })
  @ArrayMinSize(3, {
    message: 'A lista de características deve ter pelo menos 3 itens.',
  })
  @Type(() => CaracteristicaProdutoDTO)
  caracteristicas: CaracteristicaProdutoDTO[];

  @ValidateNested({ each: true })
  @IsArray({ message: 'A lista de imagens deve ser um array.' })
  @ArrayMinSize(1, {
    message: 'A lista de imagens deve ter pelo menos 1 item.',
  })
  @Type(() => ImagemProdutoDTO)
  imagens: ImagemProdutoDTO[];

  @IsString({ message: 'A categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'A categoria não pode ser vazia.' })
  categoria: string;

  @IsNotEmpty({ message: 'Data de criação é obrigatória' })
  dataCriacao: Date;

  @IsNotEmpty({ message: 'Data de atualização é obrigatória' })
  dataAtualizacao: Date;
}
