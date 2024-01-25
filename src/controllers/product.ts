import knex from '../config/connect'
import { Request, Response } from 'express'
import { uploadFile, deleteFile } from '../utils/aws/s3'
import validateImage from '../utils/product/validateImage'
import { Product, Categories } from '../types/types'

const registerProduct = async (req: Request, res: Response) => {
  const { description, stock_qty, value, category_id }: Product = req.body
  const { file: product_image } = req

  try {
    const categoryExists = await knex<Product>('categories')
      .where({ id: category_id })
      .first()

    if (!categoryExists) {
      return res.status(400).json({ message: 'Categoria não encontrada' })
    }

    const dataProduct: Omit<Product, 'id'> = {
      description,
      stock_qty,
      value,
      category_id,
      product_image: null,
    }

    await knex.transaction(async db => {
      interface CustomError extends Error {
        db: boolean
        status: number
      }

      const errorMessage = (message: string, status: number): CustomError => {
        const error = new Error() as CustomError
        error.status = status
        error.db = true
        throw error
      }

      const product = await db<Product>('products')
        .insert(dataProduct)
        .returning('*')

      if (product_image) {
        const errorValidateImage = validateImage(product_image)

        if (errorValidateImage) {
          errorMessage(errorValidateImage, 400)
        }

        const file = await uploadFile(
          product_image,
          `produtos/${product[0].id}`
        )

        if (file instanceof Error) {
          errorMessage('Erro ao salvar imagem no servidor', 500)
        }

        product[0].product_image = file as string
        dataProduct.product_image = file as string

        await db<Product>('products')
          .where({ id: product[0].id })
          .update({ product_image: file as string })
      }
    })

    return res.status(201).json(dataProduct)
  } catch (error: any) {
    if (error.db) {
      return res.status(error.status).json({ mensagem: error.message })
    }
    return res.status(500).json({ mensagem: 'Erro interno do servidor' })
  }
}

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  const { description, stock_qty, value, category_id } = req.body
  const { file: product_image } = req

  try {
    const existingProduct = await knex<Product>('products')
      .where({ id: Number(id) })
      .first()

    if (!existingProduct) {
      return res.status(400).json({ message: 'Produto não cadastrado' })
    }

    const categoryExists = await knex<Categories>('categories')
      .where({ id: category_id })
      .first()

    if (!categoryExists) {
      return res.status(400).json({ message: 'Categoria não cadastrada' })
    }

    const updatedProduct: Omit<Product, 'id'> = {
      description,
      stock_qty,
      value,
      category_id,
      product_image: existingProduct.product_image,
    }

    if (product_image) {
      const validateError = validateImage(product_image)
      if (validateError) {
        return res.status(400).json({ message: validateError })
      }
      if (
        product_image.originalname as unknown as string !== existingProduct.product_image
      ) {
        const deletionError = await deleteFile(updatedProduct.product_image as string)
        if (deletionError) {
          throw new Error('Erro interno do servidor')
        }
      }
      const file = await uploadFile(product_image, `products/${id}`)

      if (file instanceof Error) {
        return res.status(500).json({ message: 'Erro interno do servidor' })
      }

      updatedProduct.product_image = file

      await knex('products')
        .where({ id })
        .update({ product_image: updatedProduct.product_image })
        .returning('*')
    }

    return res.status(200).json(updatedProduct)
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { registerProduct, updateProduct }
