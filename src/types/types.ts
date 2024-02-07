export type User = {
  id?: number
  name: string
  email: string
  password: string
}

export type Customer = {
  id?: number
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
  id?: number
  description: string
}

export type Product = {
  id?: number
  description: string
  stock_qty: number
  value: number
  category_id: number
}

export type ProductImage = {
  id?: number
  product_id: number
  folder_id: string
  image_id: string
  image_link: string
}

export type ProductCategory = Product & { category_description: string, image_link: string}

export type ProductOrder = {
  id?: number
  order_id: number
  product_id: number
  product_qty: number
  product_value: number
}

export type Order = {
  id?: number
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
  [key: string]: Pick<ProductOrder, 'product_id' | 'product_qty'>
}
