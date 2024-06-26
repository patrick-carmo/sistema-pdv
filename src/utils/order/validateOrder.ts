import knex from '../../config/connect'
import { Product, ValidateOrder } from '../../types/types'

const validateOrder = async (
  product_order: ValidateOrder
): Promise<{ errorMessage: string[]; total_value: number }> => {
  const errorStock: string[] = []
  const errorProduct: string[] = []
  let total_value: number = 0

  const data = Object.entries(product_order)

  for (const [key, value] of data) {
    const { product_id, product_qty } = product_order[key]
    const product = await knex<Product>('products').where({ id: value.product_id }).first()

    if (!product) {
      errorProduct.push(`O produto com id "${product_id}" não foi encontrado`)
      continue
    }

    const { stock_qty, description, value: product_value } = product

    if (stock_qty - product_qty < 0) {
      errorStock.push(`Estoque insuficiente para o produto "${description}". Estoque disponível: ${stock_qty}`)
      continue
    }

    total_value += product_value * product_qty
  }

  const errorMessage: string[] = [...errorProduct, ...errorStock]

  return { errorMessage, total_value }
}

export default validateOrder
