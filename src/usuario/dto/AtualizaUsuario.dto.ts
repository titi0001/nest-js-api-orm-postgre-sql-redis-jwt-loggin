import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { EmailUnico } from '../validacao/emailUnico.validator';

export class AtualizaUsuarioDTO {
  @IsUUID(undefined, { message: 'ID inválido' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsOptional()
  nome: string;

  @IsEmail(undefined, { message: 'E-mail inválido' })
  @IsOptional()
  @EmailUnico({
    message: 'E-mail já cadastrado',
  })
  email: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  senha: string;
}
