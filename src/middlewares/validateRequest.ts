import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

const validateRequest = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.method !== 'GET' &&
      Object.keys(req.body).length === 0 &&
      Object.keys(req.params).length === 0 &&
      Object.keys(req.query).length === 0
    ) {
      return res.status(400).json({ message: 'Preencha os dados' })
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
    return res.status(400).json({ message: error.message })
  }
}

export default validateRequest
