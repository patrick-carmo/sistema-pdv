import knex from '../config/connect'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { User } from '../types/types'

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password }: User = req.body

  try {
    const emailExists = await knex<User>('users').where({ email }).first()

    if (emailExists) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const hashPassword: string = await bcrypt.hash(password, 10)

    const user = await knex<User>('users')
      .insert({
        name,
        email,
        password: hashPassword,
      })
      .returning(['name', 'email'])

    res.status(201).json(user[0])
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

const detailUser = async (req: Request, res: Response) => {
  return res.status(200).json(req.user)
}

const updateUser = async (req: Request, res: Response) => {
  const { name, email, password }: User = req.body

  try {
    const { id, email: userEmail } = req.user as User

    const user = await knex<User>('users').where({ email }).whereNot({ email: userEmail }).first()

    if (user) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const hashPassword: string = await bcrypt.hash(password, 10)

    const updatedUser = await knex<User>('users')
      .where({ id })
      .update({
        name,
        email,
        password: hashPassword,
      })
      .returning('*')

    req.user = updatedUser[0]

    return res.status(204).send()
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export { registerUser, detailUser, updateUser }
