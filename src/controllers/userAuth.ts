import knex from '../config/connect'
import { BadRequestError } from '../utils/apiError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from '../config/envConfig'
import { User } from '../types/types'
import { Request, Response } from 'express'

const userLogin = async (req: Request, res: Response) => {
  const { email, password }: User = req.body

  const user = await knex<User>('users').where({ email }).first()

  if (!user) {
    throw new BadRequestError('E-mail não cadastrado')
  }

  const isValidPassword: boolean = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    throw new BadRequestError('Senha inválida')
  }

  const token: string = jwt.sign({ id: user.id }, env.SECRET, {
    expiresIn: '30d',
  })

  const { password: _, ...userInfo } = user

  return res.status(200).json({ user: userInfo, token })
}

export default userLogin
