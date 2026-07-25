import client from '../database'
import bcrypt from 'bcrypt'

export type User = {
  id?: number
  first_name: string
  last_name: string
  password: string
}

const pepper = process.env.BCRYPT_PASSWORD as string
const saltRounds = parseInt(process.env.SALT_ROUNDS as string)

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await client.connect()

    try {
      const result = await conn.query('SELECT id, first_name, last_name FROM users')
      return result.rows
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async show(id: string): Promise<User> {
    const conn = await client.connect()

    try {
      const result = await conn.query('SELECT id, first_name, last_name FROM users WHERE id=($1)', [id])
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async create(user: User): Promise<User> {
    const conn = await client.connect()

    try {
      const hash = bcrypt.hashSync(user.password + pepper, saltRounds)
      const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES ($1, $2, $3) RETURNING id, first_name, last_name'
      const result = await conn.query(sql, [user.first_name, user.last_name, hash])
      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not create user ${user.first_name}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }

  async authenticate(first_name: string, password: string): Promise<User | null> {
    const conn = await client.connect()

    try {
      const sql = 'SELECT * FROM users WHERE first_name=($1)'
      const result = await conn.query(sql, [first_name])

      if (result.rows.length) {
        const user = result.rows[0]
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user
        }
      }

      return null
    } catch (err) {
      throw new Error(`Could not authenticate user ${first_name}. Error: ${err}`)
    } finally {
      conn.release()
    }
  }
}