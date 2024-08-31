import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { EmailUnico } from '../validacao/emailUnico.validator';

export class CriaUsuarioDTO {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsEmail(undefined, { message: 'E-mail inválido' })
  @EmailUnico({
    message: 'E-mail já cadastrado',
  })
  email: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;
}
