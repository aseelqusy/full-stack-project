import client from '../src/database'
import { UserStore } from '../src/models/user'
import { createMockConnection } from './testHelpers'

describe('User Model', () => {
  const store = new UserStore()

  it('has an index method', () => {
    expect(store.index).toBeDefined()
  })

  it('has a show method', () => {
    expect(store.show).toBeDefined()
  })

  it('has a create method', () => {
    expect(store.create).toBeDefined()
  })

  it('has an authenticate method', () => {
    expect(store.authenticate).toBeDefined()
  })

  it('returns a list of users', async () => {
    const mockConn = createMockConnection([{ id: 1, first_name: 'Jane', last_name: 'Doe' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.index()

    expect(result.length).toBe(1)
    expect(result[0].first_name).toBe('Jane')
  })

  it('returns the requested user', async () => {
    const mockConn = createMockConnection([{ id: 1, first_name: 'Jane', last_name: 'Doe' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.show('1')

    expect(result.id).toBe(1)
  })

  it('creates a user', async () => {
    const mockConn = createMockConnection([{ id: 1, first_name: 'Jane', last_name: 'Doe' }])
    spyOn(client, 'connect').and.returnValue(Promise.resolve(mockConn as never))

    const result = await store.create({ first_name: 'Jane', last_name: 'Doe', password: 'secret' })

    expect(result.first_name).toBe('Jane')
  })
})