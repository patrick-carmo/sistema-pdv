import { Router } from 'express'
import userLogin from '../controllers/userAuth'
import loginVerify from '../middlewares/validateLogin'
import listCategories from '../controllers/categories'

const route: Router = Router()

route.post('/login', userLogin)
route.get('/categorias', listCategories)

route.use(loginVerify)

export default route
