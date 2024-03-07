import { ProcessedOrder } from '../../types/types'

const formatList = (data: ProcessedOrder[]): ProcessedOrder[] => {
  const formattedData = data.map((row: any) => ({
    order: {
      id: row.order_id,
      total_value: row.total_value,
      observation: row.observation,
      customer_id: row.customer_id,
    },
    product_order: row.product_order.map((product: any) => ({
      id: product.id,
      product_qty: product.product_qty,
      product_value: product.product_value,
      order_id: product.order_id,
      product_id: product.product_id,
    })),
  }))

  return formattedData
}

export default formatList
