import { Router } from 'express'
import multerProduct from '../utils/multer/multerProduct'

import userLogin from '../controllers/userAuth'
import loginVerify from '../middlewares/validateLogin'
import listCategories from '../controllers/categories'
import { registerUser, detailUser, updateUser } from '../controllers/user'
import { registerProduct, updateProduct, listProduct, detailProduct, deleteProduct } from '../controllers/product'
import { registerCustomer, updateCustomer, listCustomer, detailCustomer } from '../controllers/customer'
import { listOrder, registerOrder } from '../controllers/order'

import validateRequest from '../middlewares/validateRequest'

import loginSchema from '../models/valitations/loginSchema'
import userSchema from '../models/valitations/userSchema'
import productSchema from '../models/valitations/productSchema'
import customerSchema from '../models/valitations/customerSchema'
import orderSchema from '../models/valitations/orderSchema'

const route: Router = Router()

route.get('/categoria', listCategories)
route.post('/login', validateRequest(loginSchema), userLogin)
route.post('/usuario', validateRequest(userSchema), registerUser)

route.use(loginVerify)

route.get('/usuario', detailUser)
route.put('/usuario', validateRequest(userSchema), updateUser)

route.post('/produto', multerProduct('product_image'), validateRequest(productSchema), registerProduct)
route.put('/produto/:id', multerProduct('product_image'), validateRequest(productSchema), updateProduct)
route.get('/produto', validateRequest(productSchema), listProduct)
route.get('/produto/:id', validateRequest(productSchema), detailProduct)
route.delete('/produto/:id', validateRequest(productSchema), deleteProduct)

route.post('/cliente', validateRequest(customerSchema), registerCustomer)
route.put('/cliente/:id', validateRequest(customerSchema), updateCustomer)
route.get('/cliente', listCustomer)
route.get('/cliente/:id', validateRequest(customerSchema), detailCustomer)

route.post('/pedido', validateRequest(orderSchema), registerOrder)
route.get('/pedido', validateRequest(orderSchema), listOrder)

export default route
