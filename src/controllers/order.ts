import knex from '../config/connect'
import { Request, Response } from 'express'
import { Customer, Order, ValidateOrder, ProcessedOrder } from '../types/types'
import validateOrder from '../utils/order/validateOrder'
import recordOrder from '../utils/order/recordOrder'
import formatList from '../utils/order/formatList'
import htmlCompiler from '../utils/email/htmlCompiler'
import transporter from '../utils/email/email'

const registerOrder = async (req: Request, res: Response) => {
  const { customer_id, observation, product_order }: Order = req.body

  try {
    const customer = await knex<Customer>('customers').where({ id: customer_id }).first()

    if (!customer) {
      return res.status(400).json({ message: 'Cliente não encontrado' })
    }

    const validationResult = await validateOrder(product_order as unknown as ValidateOrder)

    const { errorMessage, total_value } = validationResult

    if (errorMessage.length > 0) {
      return res.status(400).json({ message: errorMessage })
    }

    const dataOrder: Order = {
      customer_id,
      observation,
      product_order,
      total_value,
    }

    const order = await recordOrder(dataOrder)

    const { name } = customer

    const html = await htmlCompiler('src/models/email/orderTemplate.html', name, order.order as Order)

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

const listOrder = async (req: Request, res: Response) => {
  const { customer_id } = req.query

  try {
    const query = knex('orders')
      .select<ProcessedOrder[]>(
        'orders.id as order_id',
        'orders.total_value',
        'orders.observation',
        'orders.customer_id',
        'product_order.id as product_order_id',
        'product_order.product_qty',
        'product_order.product_value',
        'product_order.order_id as p_product_order_id',
        'product_order.product_id as p_product_product_id'
      )
      .leftJoin('product_order', 'orders.id', '=', 'product_order.order_id');

    if (customer_id) {
      query.where('orders.customer_id', customer_id)
    }

    const data = await query
    const formattedList: ProcessedOrder[] = formatList(data)

    return res.status(200).json(formattedList)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { registerOrder, listOrder }
