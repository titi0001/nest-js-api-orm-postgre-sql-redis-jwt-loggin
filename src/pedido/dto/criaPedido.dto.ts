import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PedidoItemDTO {
  @IsUUID()
  produtoId: string;

  @IsNotEmpty()
  @IsNumber()
  quantidade: number;
}

export class CriaPedidoDTO {
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => PedidoItemDTO)
  pedidosItem: PedidoItemDTO[];
}
