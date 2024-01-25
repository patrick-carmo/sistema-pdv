import { Router } from 'express'
import multer from '../utils/multer/multer'

import userLogin from '../controllers/userAuth'
import loginVerify from '../middlewares/validateLogin'
import listCategories from '../controllers/categories'
import { registerUser, detailUser, updateUser } from '../controllers/user'
import { registerProduct, updateProduct } from '../controllers/product'

import { validateRequest } from '../middlewares/validateRequest'

import loginSchema from '../models/valitations/loginSchema'
import userSchema from '../models/valitations/userSchema'

const route: Router = Router()

route.get('/categoria', listCategories)
route.post('/login', validateRequest(loginSchema), userLogin)
route.post('/usuario', validateRequest(userSchema), registerUser)

route.use(loginVerify)

route.get('/usuario', detailUser)
route.put('/usuario', validateRequest(userSchema), updateUser)

route.post('/produto', multer.single('product_image'), registerProduct)
route.put('/produto/:id', multer.single('product_image'), updateProduct)

export default route
