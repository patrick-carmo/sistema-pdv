import 'dotenv/config'
import express, { Express } from 'express'
const app: Express = express()
import swagger from 'swagger-ui-express'
import swaggerJson from './config/swagger.json'
import cors from 'cors'

import route from './routes/route'


app.use(express.json())
app.use(cors())
app.use(
  '/api-docs',
  swagger.serve,
  swagger.setup(swaggerJson, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
  })
)
app.use(route)

const port: number = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Vercel deploy
export default app
