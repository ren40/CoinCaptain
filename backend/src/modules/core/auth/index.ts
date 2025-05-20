import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { sign, decode } from 'hono/jwt'
import { z } from 'zod'
import { setCookie, getCookie } from 'hono/cookie'

import db from '../../infrastructure/db'

const auth = new Hono()

auth.use(logger())

const scheme = z.object({
    username: z.string(),
    password: z.string().min(8)
})

auth.post('/', zValidator('json', scheme), async (c) => {
    try {
        const { username, password } = await c.req.json();

        const connection = await db.connect()
        const rowsUsers = await connection`SELECT * FROM users WHERE username = ${username}`.values()

        if (rowsUsers.length === 0) {
            throw new HTTPException(404, { message: 'User not found' })
        }

        const user = rowsUsers[0]

        const isMatch = await Bun.password.verify(password, user[3], 'bcrypt')

        if (!isMatch) {
            throw new HTTPException(401, { message: 'Invalid credenttials' })
        }

        const payload = {
            username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            iat: Math.floor(Date.now() / 1000),
        }

        const token = await sign(payload, Bun.env.SECRET_KEY || '')

        setCookie(c, 'token', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        })

        return c.json({
            payload,
            token,
        })
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e instanceof Error ? e.message : 'Internal Server Error' });
        } else {
            throw new HTTPException(500, { message: 'Internal Server Error' });
        }
    }
})

auth.get('/refresh', async (c) => {
    const cookieToken = await getCookie(c, 'token')

    if (!cookieToken) {
        throw new HTTPException(401, { message: 'No  token provided' })
    }

    try {
        const decodedToken = decode(cookieToken)
        const newToken = await sign(
            { userId: decodedToken.payload.nbf },
            process.env.SECRET_KEY || '',
        )

        setCookie(c, 'auth-token', newToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        })

          return c.json({
            newToken,
        })
    } catch (e) {
        console.error('Error during token refresh:', e)
        throw new HTTPException(500, { message: e instanceof Error ? e.message : 'Internal Server Error' });
    }
})


export default auth