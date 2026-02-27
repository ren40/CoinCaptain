import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { sign } from 'hono/jwt'
import { z } from 'zod'

import dbClientInstance from '../../infrastructure/db'
import { bearerAuth } from 'hono/bearer-auth'
import { checkToken, convertArrayToObject } from '../../utils'
import { toHttpError } from '../../utils/errorHandler'
import { IUser } from '../../../types'

const auth = new Hono()
auth.use(logger())

const loginScheme = z.object({
  username: z.string(),
  password: z.string().min(8),
})

auth.post('/', zValidator('json', loginScheme), async (c) => {
  try {
    const { username, password } = await c.req.json()
    const dbClient = dbClientInstance()
    const rows = await dbClient.query<unknown[]>`SELECT * FROM users WHERE username = ${username}`

    if (rows.length === 0) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    const row = rows[0] as unknown[]
    const user = convertArrayToObject<IUser>(Object.values(row), [
      'id', 'username', 'email', 'password', 'role', 'created_at', 'updated_at',
    ]) as unknown as IUser & { password: string }

    const isMatch = await Bun.password.verify(password, String(user.password), 'bcrypt')
    if (!isMatch) {
      throw new HTTPException(401, { message: 'Invalid credentials' })
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

auth.get('/refresh', bearerAuth({
  verifyToken: async (token, c) => checkToken(c, token),
}), async (c) => {
  try {
    const payload = c.get('jwtPayload') as { username?: string } | undefined
    if (!payload?.username) {
      throw new HTTPException(401, { message: 'No token provided' })
    }
    const newPayload = {
      username: payload.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      iat: Math.floor(Date.now() / 1000),
    }
    const newToken = await sign(newPayload, process.env.SECRET_KEY || '')
    return c.json({ newToken })
  } catch (e) {
    throw toHttpError(e)
  }
})

export default auth
