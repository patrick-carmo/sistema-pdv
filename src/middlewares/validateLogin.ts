import jwt from 'jsonwebtoken'
import knex from '../config/connect'
import { Request, Response, NextFunction } from 'express'
import { User } from '../types/types'

const loginVerify = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' })
  }

  const token: string = authorization.replace('Bearer', '').trim()

  try {
    const { id } = jwt.verify(token, process.env.SECRET as string) as {
      id: number
    }

    const user = await knex<User>('users').where({ id }).first()

    if (!user) {
      return res.status(400).json({ message: 'Não autorizado!' })
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
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}

export default loginVerify
