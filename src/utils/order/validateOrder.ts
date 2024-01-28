import knex from '../../config/connect'
import { Product, ValidateOrder } from '../../types/types'

const validateOrder = async (product_order: ValidateOrder) => {
  try {
    const errorStock: string[] = []
    const errorProduct: string[] = []
    let total_value: number = 0

    const data = Object.entries(product_order)

    for (const [key, value] of data) {
      const { product_id, product_qty } = product_order[key]
      const product: Product = await knex('products').where({ id: value.product_id }).first()

      if (!product) {
        errorProduct.push(`Produto ${product_id} não encontrado`)
        continue
      }

      const { stock_qty, description, value: product_value } = product

      if (stock_qty - product_qty < 0) {
        errorStock.push(`Produto ${description} sem estoque suficiente. Estoque disponível: ${stock_qty}`)
        continue
      }

      total_value += product_value * product_qty
    }

    const errorMessage = [...errorProduct, ...errorStock]

    return { errorMessage, total_value }

  } catch (error: any) {
    return error.message as string
  }
}

export default validateOrder
