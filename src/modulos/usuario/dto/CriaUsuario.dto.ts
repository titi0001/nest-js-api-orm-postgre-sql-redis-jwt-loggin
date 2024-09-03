import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,30}$/,
    {
      message:
        'A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um dígito, um caractere especial e ter entre 6 e 30 caracteres',
    },
  )
  senha: string;
}
