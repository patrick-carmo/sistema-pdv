import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../utils/apiError'
import { ObjectSchema } from 'joi'

const validateRequest = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.method !== 'GET' &&
      Object.keys(req.body).length === 0 &&
      Object.keys(req.params).length === 0 &&
      Object.keys(req.query).length === 0
    ) {
      throw new BadRequestError('Preencha os dados')
    }

    if (Object.keys(req.body).length !== 0) {
      await schema.validateAsync({ body: req.body })
    }
    if (Object.keys(req.params).length !== 0) {
      await schema.validateAsync({ params: req.params })
    }
    if (Object.keys(req.query).length !== 0) {
      await schema.validateAsync({ query: req.query })
    }

    next()
  } catch (error: any) {
    throw new BadRequestError(error.message)
  }
}

export default validateRequest
