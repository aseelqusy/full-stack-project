import jwt from 'jsonwebtoken'

export type MockConnection = {
  query: jasmine.Spy
  release: jasmine.Spy
}

export const createToken = (): string => {
  return jwt.sign({}, process.env.TOKEN_SECRET as string)
}

export const createMockConnection = (rows: unknown[]): MockConnection => {
  return {
    query: jasmine.createSpy('query').and.returnValue(Promise.resolve({ rows })),
    release: jasmine.createSpy('release')
  }
}