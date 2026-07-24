import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import verifyAuthToken from '../middleware/auth'

const store = new OrderStore()

const currentOrderByUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.user_id)
  const order = await store.currentOrderByUser(userId)
  res.json(order)
}

const create = async (req: Request, res: Response) => {
  const order: Order = {
    user_id: Number(req.body.user_id),
    status: req.body.status || 'active'
  }

  if (Number.isNaN(order.user_id)) {
    res.status(400).json('user_id is required')
    return
  }

  const newOrder = await store.create(order)
  res.json(newOrder)
}

const addProduct = async (req: Request, res: Response) => {
  const quantity = Number(req.body.quantity)
  const orderId = Number(req.params.id)
  const productId = Number(req.body.product_id)

  if (Number.isNaN(quantity) || Number.isNaN(orderId) || Number.isNaN(productId)) {
    res.status(400).json('quantity, order_id, and product_id are required')
    return
  }

  const product = await store.addProduct(quantity, orderId, productId)
  res.json(product)
}

const orderRoutes = (app: express.Application) => {
  app.get('/orders/users/:user_id/current', verifyAuthToken, currentOrderByUser)
  app.post('/orders', verifyAuthToken, create)
  app.post('/orders/:id/products', verifyAuthToken, addProduct)
}

export default orderRoutes