export type User = {
  readonly id: number
  name: string
  email: string
  password: string
}

export type Customer = {
  readonly id: number
  name: string
  email: string
  cpf: string
  zip_code?: string
  street?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
}

export type Categories = {
  readonly id: number
  description: string
}

export type Product = {
  readonly id: number
  description: string
  stock_qty: number
  value: number
  readonly category_id: number
  product_image?: string | null
}

export type ProductCategory = Product & { category_description: string }

export type ProductOrder = {
  readonly id: number
  order_id: number
  product_id: number
  product_qty: number
  product_value: number
}

export type Order = {
  readonly id: number
  customer_id: number
  observation?: string
  total_value: number
  product_order: Pick<ProductOrder, 'product_id' | 'product_qty'>[]
}

export type ProcessedOrder = {
  order: Omit<Order, 'product_order'>
  product_order: ProductOrder[]
}

export type ValidateOrder = {
  [key: string]: Pick<ProductOrder , 'product_id' | 'product_qty'>;
}