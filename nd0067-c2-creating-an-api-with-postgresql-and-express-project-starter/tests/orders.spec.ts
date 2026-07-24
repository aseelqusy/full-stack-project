import client from '../src/database'
import { OrderStore } from '../src/models/order'
import { createMockConnection } from './testHelpers'

describe('Order Model', () => {
  const store = new OrderStore()

  it('has a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('has a currentOrderByUser method', () => {
    expect(store.currentOrderByUser).toBeDefined()
  })

  it('has an addProduct method', () => {
    expect(store.addProduct).toBeDefined()
  })

  it('creates an order', async () => {
    const mockConn = createMockConnection([{ id: 1, user_id: 1, status: 'active' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.create({ user_id: 1, status: 'active' })

    expect(result.id).toBe(1)
  })

  it('returns the current order for a user', async () => {
    const mockConn = {
      query: jasmine
        .createSpy('query')
        .and.returnValues(
          Promise.resolve({ rows: [{ id: 1, user_id: 1, status: 'active' }] }),
          Promise.resolve({ rows: [{ id: 1, name: 'Pencil', price: 2, category: 'School', quantity: 3 }] })
        ),
      release: jasmine.createSpy('release')
    }

    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.currentOrderByUser(1)

    expect(result?.products.length).toBe(1)
    expect(result?.products[0].name).toBe('Pencil')
  })

  it('adds a product to an order', async () => {
    const mockConn = createMockConnection([{ id: 1, quantity: 2, order_id: 1, product_id: 1 }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.addProduct(2, 1, 1)

    expect(result.quantity).toBe(2)
  })
})