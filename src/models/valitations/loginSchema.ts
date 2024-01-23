import joi from 'joi'
import { User } from '../../entities/types'

const loginSchema = joi
  .object({
    body: joi.object<User>({
      email: joi.string().email().required().messages({
        'any.required': 'O campo email é obrigatório',
        'string.empty': 'O campo email é obrigatório',
        'string.email': 'Informe um email válido',
      }),
      password: joi.string().required().messages({
        'any.required': 'O campo senha é obrigatório',
        'string.empty': 'O campo senha é obrigatório',
      }),
    }),
  })
  .unknown()

export default loginSchema