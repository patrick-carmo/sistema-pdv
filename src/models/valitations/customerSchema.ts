import joi from 'joi';
import { Customer } from '../../entities/customerType'

const customerSchema = joi
  .object({
    body: joi.object<Customer>({
      name: joi.string().required().min(4).messages({
        'any.required': 'O campo nome é obrigatório',
        'string.empty': 'O campo nome é obrigatório',
        'string.min': 'O campo nome deve ter pelo menos 4 caracteres',
      }),
      email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'Informe um email válido',
      }),
      cpf: joi
        .string()
        .required()
        .min(11)
        .max(11)
        .pattern(/^[0-9]+$/)
        .messages({
          'any.required': 'O campo cpf é obrigatório',
          'string.empty': 'O campo cpf é obrigatório',
          'string.min': 'O campo cpf deve ter pelo menos 11 dígitos',
          'string.max': 'O campo cpf deve ter no máximo 11 dígitos',
          'string.pattern.base': 'O CPF deve conter apenas números',
        }),
      zipCode: joi
        .string()
        .min(8)
        .max(8)
        .pattern(/^[0-9]+$/)
        .messages({
          'string.min': 'O campo cep deve ter 8 dígitos',
          'string.max': 'O campo cep deve ter 8 dígitos',
          'string.pattern.base': 'O CEP deve conter apenas números',
        }),
      state: joi.string().min(2).max(2).messages({
        'string.min': 'O campo estado deve ter 2 caracteres',
        'string.max': 'O campo estado deve ter 2 caracteres',
      }),
    }),
  })
  .unknown();

export default customerSchema;
