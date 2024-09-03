import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsuarioService } from '../usuario.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailUnicoValidator implements ValidatorConstraintInterface {
  constructor(private usuarioService: UsuarioService) {}

  async validate(value: any): Promise<boolean> {
    try {
      const usuarioComEmailExiste =
        await this.usuarioService.buscaPorEmail(value);

      return !usuarioComEmailExiste;
    } catch (erro) {
      if (erro instanceof NotFoundException) {
        return true;
      }

      throw erro;
    }
  }
}

export const EmailUnico = (opcoesDeValidacao: ValidationOptions) => {
  return (objeto: object, propriedade: string) => {
    registerDecorator({
      target: objeto.constructor,
      propertyName: propriedade,
      options: opcoesDeValidacao,
      constraints: [],
      validator: EmailUnicoValidator,
    });
  };
};
