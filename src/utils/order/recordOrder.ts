import knex from '../../config/connect'
import { BadRequestError } from '../../utils/apiError'
import { Order, ProductOrder, Product, ProcessedOrder } from '../../types/types'

const recordOrder = async (dataOrder: Order): Promise<ProcessedOrder> => {
  const { customer_id, observation, product_order, total_value } = dataOrder

  const data: ProcessedOrder[] = []
  const insertedDataOrder: any[] = []

  await knex.transaction(async db => {
    const orders = await db<Order>('orders').insert({ customer_id, observation, total_value }).returning('*')

    const { id } = orders[0]

    for (const order of product_order) {
      const { product_id, product_qty } = order

      const product = await db<Product>('products').where({ id: product_id }).first()

      if (!product) {
        throw new BadRequestError(`Produto ${product_id} não encontrado`)
      }

      const insertedData = await db<ProductOrder>('product_order')
        .insert({ order_id: id, product_id, product_qty, product_value: product.value })
        .returning('*')

      insertedDataOrder.push(insertedData[0])

      const newStockQty = product.stock_qty - product_qty

      await db('products').where({ id: product_id }).update({ stock_qty: newStockQty })
    }

    data.push({ order: orders[0], product_order: insertedDataOrder })
  })

  return data[0]
}

export default recordOrder
