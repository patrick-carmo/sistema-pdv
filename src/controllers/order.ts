import knex from '../config/connect'
import { Request, Response } from 'express'
import { Customer, Order, ValidateOrder } from '../types/types'
import validateOrder from '../utils/order/validateOrder'
import recordOrder from '../utils/order/recordOrder'
import htmlCompiler from '../utils/email/htmlCompiler'
import transporter from '../utils/email/email'

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

    const order = await recordOrder(dataOrder)

    if (order instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }

    const { name } = customer

    const html = await htmlCompiler('src/models/email/orderTemplate.html', name, order.order as Order)

    if (html instanceof Error) {
      return res.status(500).json({ message: 'Erro interno do servidor' })
    }

    const mailOptions = {
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
      to: `${name} <${customer.email}>`,
      subject: 'Pedido realizado com sucesso',
      html,
    }

    await transporter.sendMail(mailOptions)

    return res.status(201).json(order)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { registerOrder }
