import knex from '../config/connect'
import { Request, Response } from 'express'
import { Customer, Order, ValidateOrder } from '../types/types'
import validateOrder from '../utils/order/validateOrder'

const registerOrder = async (req: Request, res: Response) => {
  const { customer_id, observation, product_order } = req.body as Order

  try {
    const customer = await knex<Customer>('customers').where({ id: customer_id }).first()

    if (!customer) {
      return res.status(400).json({ message: 'Cliente não encontrado' })
    }

    const result = await validateOrder(product_order as unknown as ValidateOrder)

    if (typeof result === 'string') {
      return res.status(400).json({ message: 'Erro interno do servidor' })
    }

    const { errorMessage, total_value } = result

    if (errorMessage.length > 0) {
      return res.status(400).json({ message: errorMessage })
    }

    const dataOrder: Omit<Order, 'id'> = {
      customer_id,
      observation,
      product_order,
      total_value,
    }


  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { registerOrder }