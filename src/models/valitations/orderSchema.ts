import joi from 'joi'
import { Order } from '../../types/types'

const orderSchema = joi.object({
  body: joi
    .object<Order>({
      customer_id: joi.number().required().positive().integer().messages({
        'any.required': 'O id do cliente é obrigatório',
        'number.base': 'O id do cliente deve ser um número inteiro',
        'number.positive': 'O id do cliente deve ser um número inteiro',
        'number.integer': 'O id do cliente deve ser um número inteiro',
      }),
      observation: joi.string().allow(''),
      product_order: joi.array().items(
        joi.object({
          product_id: joi.number().required().positive().integer().messages({
            'any.required': 'O id do produto é obrigatório',
            'number.base': 'O id do produto deve ser um número inteiro',
            'number.positive': 'O id do produto deve ser um número inteiro',
            'number.integer': 'O id do produto deve ser um número inteiro',
          }),
          product_qty: joi.number().required().integer().positive().messages({
            'any.required': 'A quantidade do produto é obrigatória',
            'number.base': 'A quantidade do produto deve ser um número inteiro',
            'number.positive': 'A quantidade do produto deve ser um número inteiro',
            'number.integer': 'A quantidade do produto deve ser um número inteiro',
          }),
        })
      ),
    })
    .messages({
      'array.base': 'O pedido deve conter o id do produto e a quantidade',
    }),
  query: joi
    .object({
      customer_id: joi.number().integer().positive().messages({
        'number.empty': 'O id do cliente é obrigatório',
        'number.base': 'O id do cliente deve ser um número inteiro',
        'number.positive': 'O id do cliente deve ser um número inteiro',
        'number.integer': 'O id do cliente deve ser um número inteiro',
      }),
    })
    .unknown(),
})

export default orderSchema