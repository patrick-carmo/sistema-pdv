export {}
import { User } from '../types'

declare global {
  namespace Express {
    interface Request {
      user?: User | Omit<User, 'password'>
    }
  }
}
