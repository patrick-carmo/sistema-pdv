import knex from '../config/connect'
import { Request, Response } from 'express'
import { Categories } from '../types/types'

const listCategories = async (_: Request, res: Response) => {
  const categories = await knex<Categories>('categories')
  res.status(200).json(categories)
}

export default listCategories
