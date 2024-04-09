import 'dotenv/config'
import 'express-async-errors'
import express, { Express } from 'express'
const app: Express = express()
import env from './config/envConfig'
import swagger from 'swagger-ui-express'
import swaggerJson from './config/swagger.json'
import cors from 'cors'

import route from './routes/route'
import errorMiddleware from './middlewares/error'

app.use(express.json())
app.use(cors())
app.use(
  '/api-doc',
  swagger.serve,
  swagger.setup(swaggerJson, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
  })
)
app.use(route)
app.use(errorMiddleware)

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`)
})

export default app
