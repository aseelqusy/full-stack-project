import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import productRoutes from './handlers/products'
import userRoutes from './handlers/users'
import orderRoutes from './handlers/orders'

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())
app.use(cors())

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!')
})

productRoutes(app)
userRoutes(app)
orderRoutes(app)

if (require.main === module) {
  app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
  })
}

export default app