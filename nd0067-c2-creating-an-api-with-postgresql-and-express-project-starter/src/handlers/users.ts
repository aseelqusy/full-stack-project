import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, UserStore } from '../models/user'
import verifyAuthToken from '../middleware/auth'

const store = new UserStore()

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index()
    res.json(users)
  } catch (err) {
    res.status(500).json(`Could not get users. Error: ${err}`)
  }
}

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(req.params.id)
    res.json(user)
  } catch (err) {
    res.status(500).json(`Could not get user. Error: ${err}`)
  }
}

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    }

    const newUser = await store.create(user)
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string)
    res.json(token)
  } catch (err) {
    res.status(500).json(`Could not create user. Error: ${err}`)
  }
}

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.authenticate(req.body.first_name, req.body.password)

    if (!user) {
      res.status(401).json('Invalid username or password')
      return
    }

    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string)
    res.json(token)
  } catch (err) {
    res.status(500).json(`Could not authenticate user. Error: ${err}`)
  }
}

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index)
  app.get('/users/:id', verifyAuthToken, show)
  app.post('/users', create)
  app.post('/users/authenticate', authenticate)
}

export default userRoutes