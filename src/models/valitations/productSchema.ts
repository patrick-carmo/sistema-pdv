import joi from 'joi'
import { Product } from '../../types/types'

const productSchema = joi.object({
  body: joi.object<Product & { product_image: string }>({
    description: joi.string().required().min(4).messages({
      'any.required': 'O campo descrição é obrigatório',
      'string.empty': 'O campo descrição é obrigatório',
      'string.min': 'O campo descrição deve ter pelo menos 4 caracteres',
    }),
    stock_qty: joi.number().integer().positive().required().messages({
      'any.required': 'O campo da quantidade do estoque é obrigatório',
      'number.empty': 'O campo da quantidade do estoque é obrigatório',
      'number.base': 'O campo da quantidade do estoque deve ser um número',
      'number.positive': 'O campo da quantidade do estoque deve ser um número positivo',
      'number.integer': 'O campo da quantidade do estoque deve ser um número inteiro',
    }),
    value: joi.number().integer().positive().required().messages({
      'any.required': 'O campo valor é obrigatório',
      'number.empty': 'O campo valor é obrigatório',
      'number.base': 'O campo valor deve ser um número',
      'number.positive': 'O campo valor deve ser um número positivo',
      'number.integer': 'O campo valor deve ser um número inteiro',
    }),
    category_id: joi.number().integer().positive().required().messages({
      'any.required': 'O campo categoria é obrigatório',
      'number.empty': 'O campo categoria é obrigatório',
      'number.base': 'O campo categoria deve ser um número',
      'number.positive': 'O campo categoria deve ser um número positivo',
      'number.integer': 'O campo categoria deve ser um número inteiro',
    }),
    product_image: joi.string().allow(''),
  }),
  query: joi
    .object({
      category_id: joi.number().integer().positive().messages({
        'number.empty': 'O id da categoria é obrigatório',
        'number.base': 'O id da categoria deve ser um número',
        'number.positive': 'O id da categoria deve ser um número positivo',
        'number.integer': 'O id da categoria deve ser um número inteiro',
      }),
    })
    .unknown(),
  params: joi.object({
    id: joi.number().integer().positive().required().messages({
      'any.required': 'O id do produto é obrigatório',
      'number.empty': 'O id do produto é obrigatório',
      'number.base': 'O id do produto deve ser um número',
      'number.positive': 'O id do produto deve ser um número positivo',
      'number.integer': 'O id do produto deve ser um número inteiro',
    }),
  }),
})

export default productSchema
