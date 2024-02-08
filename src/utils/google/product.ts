import knex from '../../config/connect'
import { uploadFile, createFolder, searchFolder } from './drive'
import { Product, ProductImage } from '../../types/types'

const registerFullProduct = async (
  product_image: Express.Multer.File,
  dataProduct: Product & Partial<ProductImage>,
  update: string | null
) => {
  try {
    const folder = update ? update : await searchFolder(dataProduct.description)

    const folder_id = folder ?? (await createFolder(dataProduct.description))

    const { image_id, image_link } = await uploadFile(product_image, folder_id)

    const commit = await knex.transaction(async db => {
      const { id } = dataProduct
      dataProduct.id = undefined

      if (!update) {
        const product = await db<Product>('products').insert(dataProduct).returning('*')
        const image = await db<ProductImage>('product_images')
          .insert({ product_id: product[0].id, folder_id, image_id, image_link })
          .returning('*')

        const formattedData: Product & Pick<ProductImage, 'image_link'> = {
          ...product[0],
          image_link: image[0].image_link,
        }

        return formattedData
      }

      const product = await db<Product>('products').where({ id }).update(dataProduct).returning('*')
      const image = await db<ProductImage>('product_images')
        .where({ product_id: id })
        .update({ folder_id, image_id, image_link })
        .returning('*')

      const formattedData: Product & Pick<ProductImage, 'image_link'> = {
        ...product[0],
        image_link: image[0].image_link,
      }

      return formattedData
    })

    return commit
  } catch (error: any) {
    throw error
  }
}

export { registerFullProduct }
