import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { StatusPedido } from '../enum/statusPedido.enum';

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsNumber()
  valorTotal: number;

  @IsNotEmpty()
  @IsEnum(StatusPedido)
  status: StatusPedido;
}
