import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { sign } from 'hono/jwt'
import { z } from 'zod'
import dbClientInstance from '../../infrastructure/db'
import { toHttpError } from '../../utils/errorHandler'

const user = new Hono()
user.use(logger())

const registerScheme = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
})

user.post('/register', zValidator('json', registerScheme), async (c) => {
  try {
    const { username, password, email } = c.req.valid('json')
    const dbClient = dbClientInstance()

    const passwordHash = await Bun.password.hash(password, 'bcrypt')
    if (passwordHash === null) {
      throw new HTTPException(500, { message: 'Internal Server Error' })
    }

    const rows = await dbClient.query<unknown[]>`INSERT INTO users (username, email, password_hash) VALUES (${username}, ${email}, ${passwordHash}) RETURNING *`

    if (rows.length === 0) {
      throw new HTTPException(500, { message: 'Failed to create user' })
    }

    const payload = {
      username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    }
    const token = await sign(payload, Bun.env.SECRET_KEY || '')

    return c.json({ payload, token })
  } catch (e) {
    throw toHttpError(e)
  }
})

export default user
