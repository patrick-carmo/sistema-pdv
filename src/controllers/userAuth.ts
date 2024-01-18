import knex from '../config/connect'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../entities/userType'
import { Request, Response } from 'express'

export const userLogin = async (req: Request, res: Response) => {
  const { email, password }: User = req.body

  try {
    const user = await knex<User>('users').where({ email }).first()

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Senha inválida' })
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET as string, {
      expiresIn: '30d',
    })

    const { password: _, ...userInfo } = user

    return res.status(200).json({ user: userInfo, token })
  } catch {
    return res.status(400).json({ message: 'Erro ao realizar login' })
  }
}
