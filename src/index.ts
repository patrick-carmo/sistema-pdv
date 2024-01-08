import 'dotenv/config'
import express, { Express } from 'express'
import routes from './routes/routes'
const app: Express = express()

app.use(express.json())
app.use(routes)

const port: number = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})