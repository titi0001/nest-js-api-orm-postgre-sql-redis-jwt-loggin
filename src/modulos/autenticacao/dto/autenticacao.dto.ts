import { IsEmail, IsNotEmpty } from 'class-validator';

export class AutenticaDTO {
  @IsEmail(undefined, { message: 'Email inválido' })
  email: string;

  @IsNotEmpty({ message: 'Senha inválida' })
  senha: string;
}
