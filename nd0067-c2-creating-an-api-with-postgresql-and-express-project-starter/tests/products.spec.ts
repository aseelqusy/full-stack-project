import client from '../src/database'
import { ProductStore } from '../src/models/product'
import { createMockConnection } from './testHelpers'

describe('Product Model', () => {
  const store = new ProductStore()

  it('has an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('has a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('has a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('returns a list of products', async () => {
    const mockConn = createMockConnection([{ id: 1, name: 'Pencil', price: 2, category: 'School' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.index()

    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Pencil')
  })

  it('returns the requested product', async () => {
    const mockConn = createMockConnection([{ id: 1, name: 'Pencil', price: 2, category: 'School' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.show('1')

    expect(result.id).toBe(1)
  })

  it('creates a product', async () => {
    const mockConn = createMockConnection([{ id: 1, name: 'Pencil', price: 2, category: 'School' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.create({ name: 'Pencil', price: 2, category: 'School' })

    expect(result.name).toBe('Pencil')
  })
})