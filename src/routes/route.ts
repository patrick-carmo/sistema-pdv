import { Router } from 'express'

import userLogin from '../controllers/userAuth'
import loginVerify from '../middlewares/validateLogin'
import listCategories from '../controllers/categories'
import { registerUser } from '../controllers/user'

import customerSchema from '../models/valitations/customerSchema'
import loginSchema from '../models/valitations/loginSchema'
import userSchema from '../models/valitations/userSchema'

const route: Router = Router()

route.post('/login', userLogin)
route.post('/usuario', registerUser)
route.get('/categoria', listCategories)

route.use(loginVerify)

export default route
