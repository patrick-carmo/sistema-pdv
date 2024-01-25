import 'dotenv/config'
import express, { Express } from 'express'
import route from './routes/route'
const app: Express = express()

app.use(express.json())
app.use(route)

const port: number = Number(process.env.PORT) || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
