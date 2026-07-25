import client from '../database'

export type Order = {
  id?: number
  user_id: number
  status: string
}

export type OrderProduct = {
  id?: number
  order_id: number
  product_id: number
  quantity: number
}

export type CurrentOrderProduct = {
  id: number
  name: string
  price: number
  category: string | null
  quantity: number
}

export type CurrentOrder = {
  id: number
  user_id: number
  status: string
  products: CurrentOrderProduct[]
}

export class OrderStore {
  async create(order: Order): Promise<Order> {
    const conn = await client.connect()

    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *'
      const result = await conn.query(sql, [order.user_id, order.status])
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create order for user ${order.user_id}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async currentOrderByUser(user_id: number): Promise<CurrentOrder | null> {
    const conn = await client.connect()

    try {
      const orderQuery = 'SELECT * FROM orders WHERE user_id = $1 AND status = $2 ORDER BY id DESC LIMIT 1'
      const orderResult = await conn.query(orderQuery, [user_id, 'active'])

      if (!orderResult.rows.length) {
        return null
      }

      const order = orderResult.rows[0]
      const productsQuery = `
        SELECT p.id, p.name, p.price, p.category, op.quantity
        FROM order_products op
        INNER JOIN products p ON p.id = op.product_id
        WHERE op.order_id = $1
        ORDER BY p.id
      `
      const productsResult = await conn.query(productsQuery, [order.id])

      return {
        id: order.id,
        user_id: order.user_id,
        status: order.status,
        products: productsResult.rows
      }
    } catch (err) {
      throw new Error(`Could not find current order for user ${user_id}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async addProduct(quantity: number, order_id: number, product_id: number): Promise<OrderProduct> {
    const conn = await client.connect()

    try {
      const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [quantity, order_id, product_id])
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not add product ${product_id} to order ${order_id}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }
}