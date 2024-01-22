import knex from '../config/connect'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { User } from '../entities/types'

interface UserRequest extends Request {
  user?: Omit<User, 'password'>
}

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password }: User = req.body

  try {
    const thereEmail = await knex<User>('users').where({ email }).first()

    if (thereEmail) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await knex<User>('users')
      .insert({
        name,
        email,
        password: hashPassword,
      })
      .returning(['nome', 'email'])

    res.status(201).json(user[0])
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export const detailUser = async (req: UserRequest, res: Response) => {
  return res.status(200).json(req.user)
}

export const updateUser = async (req: UserRequest, res: Response) => {
  const { name, email, password }: User = req.body

  try {
    const { id, email: userEmail } = req.user as User

    const user = await knex<User>('users')
      .where({ email })
      .whereNot({ email: userEmail })
      .first()

    if (user) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const updatedUser = await knex<User>('users')
      .where({ id })
      .update({
        name,
        email,
        password: hashPassword,
      })
      .returning('*')

    req.user = updatedUser[0]

    const { password: _, ...userInfo } = updatedUser[0]

    return res.status(204).send()
  } catch {
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
