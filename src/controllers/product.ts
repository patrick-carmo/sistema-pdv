import knex from '../config/connect'
import { Request, Response } from 'express'
import { BadRequestError } from '../utils/apiError'
import { deleteFile } from '../utils/google/drive'
import { registerFullProduct } from '../utils/google/product'
import { Product, Categories, ProductCategory, ProductOrder, ProductImage } from '../types/types'

const registerProduct = async (req: Request, res: Response) => {
  const { description, stock_qty, value, category_id }: Product = req.body
  const { file: product_image } = req

  const categoryExists = await knex<Product>('categories').where({ id: category_id }).first()

  if (!categoryExists) {
    throw new BadRequestError('Categoria não cadastrada')
  }

  const dataProduct: Product = {
    description: description.toLocaleLowerCase(),
    stock_qty,
    value,
    category_id,
  }

  if (!product_image) {
    const product = await knex<Product>('products').insert(dataProduct).returning('*')
    return res.status(201).json(product[0])
  }

  const fileCreated = await registerFullProduct(product_image, dataProduct, null)

  return res.status(201).json(fileCreated)
}

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as Product
  const { description, stock_qty, value, category_id }: ProductCategory = req.body
  const { file: product_image } = req

  const product = await knex<Product>('products').where({ id }).first()

  if (!product) {
    throw new BadRequestError('Produto não encontrado')
  }

  const categoryExists = await knex<Categories>('categories').where({ id: category_id }).first()

  if (!categoryExists) {
    throw new BadRequestError('Categoria não cadastrada')
  }

  const updatedProduct: Product = {
    id,
    description,
    stock_qty,
    value,
    category_id,
  }

  if (!product_image) {
    const updated = await knex<Product>('products').where({ id }).update(updatedProduct).returning('*')

    if (updated.length === 0) {
      throw new Error()
    }

    return res.status(200).json(updatedProduct)
  }

  const image = await knex<ProductImage>('product_images').where({ product_id: id }).first()

  image ? await deleteFile(image.image_id) : null

  const updated = image
    ? await registerFullProduct(product_image, updatedProduct, image.folder_id)
    : await registerFullProduct(product_image, updatedProduct, null)

  return res.status(200).json(updated)
}

const listProduct = async (req: Request, res: Response) => {
  const { category_id } = req.query

  const query = knex('products')
    .select<ProductCategory[]>(
      'products.*',
      'categories.description as category_description',
      'product_images.image_link'
    )
    .join('categories', 'categories.id', '=', 'products.category_id')
    .leftJoin('product_images', 'products.id', '=', 'product_images.product_id')

  if (category_id) {
    query.where({ category_id })
  }

  const product = await query

  return res.status(200).json(product)
}

const detailProduct = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as Product

  const product = await knex('products')
    .select<ProductCategory>(
      'products.*',
      'categories.description as category_description',
      'product_images.image_link'
    )
    .join('categories', 'products.category_id', '=', 'categories.id')
    .leftJoin('product_images', 'products.id', '=', 'product_images.product_id')
    .where({ 'products.id': id })
    .first()

  if (!product) {
    throw new BadRequestError('Produto não encontrado')
  }

  return res.status(200).json(product)
}

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params as unknown as Product

  const productOrder = await knex<ProductOrder>('product_order').where({ product_id: id }).first()

  if (productOrder) {
    throw new BadRequestError('Produto vinculado a um pedido')
  }

  const product = await knex<Product>('products').where({ id }).first()

  if (!product) {
    throw new BadRequestError('Produto não encontrado')
  }

  const productImage = await knex<ProductImage>('product_images').where({ product_id: id }).first()

  if (productImage) {
    await deleteFile(productImage.image_id)
  }

  await knex.transaction(async db => {
    await db<ProductImage>('product_images').where({ product_id: id }).delete()
    await db<Product>('products').where({ id }).delete()
  })

  return res.status(204).send()
}

export { registerProduct, updateProduct, listProduct, detailProduct, deleteProduct }
