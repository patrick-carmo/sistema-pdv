import { Request, Response, NextFunction } from 'express'

const validateRequest =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema instanceof Array) {
        for (const currentSchema of schema) {
          await currentSchema.validate(req)
        }

        return next()
      }

      await schema.validateAsync(req)
      next()
    } catch (error: any) {
      return res.status(400).json({ message: error.message})
    }
  }
