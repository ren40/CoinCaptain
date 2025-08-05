import { Hono } from 'hono'
import { IUser } from '../../../types'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { sign } from 'hono/jwt'
import { z } from 'zod'
import dbClientInstance from '../../infrastructure/db'

const user = new Hono()

user.use(logger())

const schemeRegister = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
})

user.post('/register', zValidator('json', schemeRegister), async (c) => {
    try {
        const { username, password, email } = c.req.valid('json')

        const dbClient = await dbClientInstance()

        const userPasswordHash = await Bun.password.hash(password, 'bcrypt')

        if (userPasswordHash === null) {
            throw new HTTPException(500, { message: 'Internal Server Error' })
        }

        const user = await dbClient.request<IUser>(`
            INSERT INTO users (username, email, password_hash) VALUES ('${username}', '${email}', '${userPasswordHash}') RETURNING *
        `)

        const payload = {
            username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            iat: Math.floor(Date.now() / 1000),
        }

        const token = await sign(payload, Bun.env.SECRET_KEY || '')

        return c.json({
            payload,
            token,
        })
    } catch (e) {
        console.error(e)
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal Server Error' })
        }
    }
})

export default user