import knex from '../config/connect'
import { Request, Response } from 'express'
import { Categories } from '../entities/types'

const listCategories = async (_: Request, res: Response) => {
  try {
    const categories = await knex<Categories>('categories')
    res.status(200).json(categories)
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export default listCategories
