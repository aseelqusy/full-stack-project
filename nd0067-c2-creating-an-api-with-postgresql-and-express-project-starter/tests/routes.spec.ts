import request from 'supertest'
import app from '../src/server'
import { ProductStore } from '../src/models/product'
import { UserStore } from '../src/models/user'
import { OrderStore } from '../src/models/order'
import { createToken } from './testHelpers'

describe('API Routes', () => {
  const token = createToken()

  it('GET / returns a welcome message', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello World!')
  })

  it('GET /products returns products', async () => {
    spyOn(ProductStore.prototype, 'index').and.resolveTo([{ id: 1, name: 'Pencil', price: 2, category: 'School' }])

    const response = await request(app).get('/products')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('POST /users creates a user and returns a token', async () => {
    spyOn(UserStore.prototype, 'create').and.resolveTo({ id: 1, first_name: 'Jane', last_name: 'Doe' } as never)

    const response = await request(app)
      .post('/users')
      .send({ first_name: 'Jane', last_name: 'Doe', password: 'secret' })

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('GET /users is protected by JWT', async () => {
    spyOn(UserStore.prototype, 'index').and.resolveTo([{ id: 1, first_name: 'Jane', last_name: 'Doe' }])

    const response = await request(app).get('/users').set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('POST /orders creates an order', async () => {
    spyOn(OrderStore.prototype, 'create').and.resolveTo({ id: 1, user_id: 1, status: 'active' } as never)

    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: 1, status: 'active' })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('active')
  })

  it('GET /orders/users/:user_id/current returns the current order', async () => {
    spyOn(OrderStore.prototype, 'currentOrderByUser').and.resolveTo({
      id: 1,
      user_id: 1,
      status: 'active',
      products: []
    } as never)

    const response = await request(app)
      .get('/orders/users/1/current')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user_id).toBe(1)
  })

  it('POST /orders/:id/products adds a product to an order', async () => {
    spyOn(OrderStore.prototype, 'addProduct').and.resolveTo({ id: 1, quantity: 2, order_id: 1, product_id: 1 } as never)

    const response = await request(app)
      .post('/orders/1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2, product_id: 1 })

    expect(response.status).toBe(200)
    expect(response.body.quantity).toBe(2)
  })

  it('POST /products is protected by JWT', async () => {
    spyOn(ProductStore.prototype, 'create').and.resolveTo({ id: 1, name: 'Pencil', price: 2, category: 'School' })

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pencil', price: 2, category: 'School' })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Pencil')
  })
})