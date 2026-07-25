import client from '../database'

export type Product = {
  id?: number
  name: string
  price: number
  category?: string
}

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await client.connect()

    try {
      const sql = 'SELECT * FROM products'
      const result = await conn.query(sql)
      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async show(id: string): Promise<Product> {
    const conn = await client.connect()

    try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      const result = await conn.query(sql, [id])
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async create(product: Product): Promise<Product> {
    const conn = await client.connect()

    try {
      const sql = 'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *'
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category
      ])
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create product ${product.name}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }
}