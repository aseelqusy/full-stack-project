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

  // ---------------------------------------------------------------------
  // Products
  // ---------------------------------------------------------------------

  it('GET /products returns products', async () => {
    spyOn(ProductStore.prototype, 'index').and.resolveTo([
      { id: 1, name: 'Pencil', price: 2, category: 'School' }
    ])

    const response = await request(app).get('/products')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('GET /products/:id returns the requested product', async () => {
    spyOn(ProductStore.prototype, 'show').and.resolveTo({
      id: 1,
      name: 'Pencil',
      price: 2,
      category: 'School'
    } as never)

    const response = await request(app).get('/products/1')

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(1)
    expect(response.body.name).toBe('Pencil')
  })

  it('POST /products is protected by JWT', async () => {
    spyOn(ProductStore.prototype, 'create').and.resolveTo({
      id: 1,
      name: 'Pencil',
      price: 2,
      category: 'School'
    })

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pencil', price: 2, category: 'School' })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Pencil')
  })

  it('POST /products rejects requests without a token', async () => {
    const response = await request(app)
      .post('/products')
      .send({ name: 'Pencil', price: 2, category: 'School' })

    expect(response.status).toBe(401)
  })

  // ---------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------

  it('POST /users creates a user and returns a token', async () => {
    spyOn(UserStore.prototype, 'create').and.resolveTo({
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe'
    } as never)

    const response = await request(app)
      .post('/users')
      .send({ first_name: 'Jane', last_name: 'Doe', password: 'secret' })

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('GET /users is protected by JWT', async () => {
    spyOn(UserStore.prototype, 'index').and.resolveTo([
      { id: 1, first_name: 'Jane', last_name: 'Doe' }
    ])

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  it('GET /users rejects requests without a token', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(401)
  })

  it('GET /users/:id returns the requested user', async () => {
    spyOn(UserStore.prototype, 'show').and.resolveTo({
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe'
    } as never)

    const response = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(1)
    expect(response.body.first_name).toBe('Jane')
  })

  it('GET /users/:id is protected by JWT', async () => {
    const response = await request(app).get('/users/1')

    expect(response.status).toBe(401)
  })

  it('POST /users/authenticate returns a token for valid credentials', async () => {
    spyOn(UserStore.prototype, 'authenticate').and.resolveTo({
      id: 1,
      first_name: 'Jane',
      last_name: 'Doe'
    } as never)

    const response = await request(app)
      .post('/users/authenticate')
      .send({ first_name: 'Jane', password: 'secret' })

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
  })

  it('POST /users/authenticate rejects invalid credentials', async () => {
    spyOn(UserStore.prototype, 'authenticate').and.resolveTo(null)

    const response = await request(app)
      .post('/users/authenticate')
      .send({ first_name: 'Jane', password: 'wrong' })

    expect(response.status).toBe(401)
  })

  // ---------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------

  it('POST /orders creates an order', async () => {
    spyOn(OrderStore.prototype, 'create').and.resolveTo({
      id: 1,
      user_id: 1,
      status: 'active'
    } as never)

    const response = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: 1, status: 'active' })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('active')
  })

  it('POST /orders rejects requests without a token', async () => {
    const response = await request(app)
      .post('/orders')
      .send({ user_id: 1, status: 'active' })

    expect(response.status).toBe(401)
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

  it('GET /orders/users/:user_id/current is protected by JWT', async () => {
    const response = await request(app).get('/orders/users/1/current')

    expect(response.status).toBe(401)
  })

  it('POST /orders/:id/products adds a product to an order', async () => {
    spyOn(OrderStore.prototype, 'addProduct').and.resolveTo({
      id: 1,
      quantity: 2,
      order_id: 1,
      product_id: 1
    } as never)

    const response = await request(app)
      .post('/orders/1/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2, product_id: 1 })

    expect(response.status).toBe(200)
    expect(response.body.quantity).toBe(2)
  })

  it('POST /orders/:id/products rejects requests without a token', async () => {
    const response = await request(app)
      .post('/orders/1/products')
      .send({ quantity: 2, product_id: 1 })

    expect(response.status).toBe(401)
  })
})