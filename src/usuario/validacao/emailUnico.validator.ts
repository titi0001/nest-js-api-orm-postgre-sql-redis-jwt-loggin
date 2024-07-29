import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsuarioRepository } from '../usuario.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailUnicoValidator implements ValidatorConstraintInterface {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async validate(value: any): Promise<boolean> {
    const emailExiste = await this.usuarioRepository.buscarPorEmail(value);
    return !emailExiste;
  }
}

export const EmailUnico = (opcoesDeValidacao: ValidationOptions) => {
  return (objeto: Record<string, any>, propriedade: string) => {
    registerDecorator({
      target: objeto.constructor,
      propertyName: propriedade,
      options: opcoesDeValidacao,
      constraints: [],
      validator: EmailUnicoValidator,
    });
  };
};
