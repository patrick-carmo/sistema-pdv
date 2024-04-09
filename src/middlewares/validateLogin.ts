import jwt from 'jsonwebtoken'
import { BadRequestError, UnauthorizedError } from '../utils/apiError'
import knex from '../config/connect'
import { Request, Response, NextFunction } from 'express'
import env from '../config/envConfig'
import { User } from '../types/types'

const loginVerify = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new UnauthorizedError('Não autorizado!')
  }

  const token: string = authorization.replace('Bearer', '').trim()

  try {
    const { id } = jwt.verify(token, env.SECRET) as {
      id: number
    }

    const user = await knex<User>('users').where({ id }).first()

    if (!user) {
      throw new UnauthorizedError('Não autorizado!')
    }

    const { password: _password, ...userInfo } = user

    req.user = userInfo

    next()
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Sessão expirada' })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Não autorizado!' })
    }
    throw error
  }
}

export default loginVerify
