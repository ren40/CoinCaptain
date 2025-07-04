import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { zValidator } from '@hono/zod-validator'
import { sign } from 'hono/jwt'
import { z } from 'zod'

import dbClientInstance from '../../infrastructure/db'
import { bearerAuth } from 'hono/bearer-auth'
import { checkToken, convertArrayToObject } from '../../utils'
import { IUser } from '../../../types'

const auth = new Hono()

auth.use(logger())

const scheme = z.object({
    username: z.string(),
    password: z.string().min(8)
})

auth.post('/', zValidator('json', scheme), async (c) => {
    try {
        const { username, password } = await c.req.json();

        const dbClient = await dbClientInstance()
        const rowsUsers = await dbClient.request<Array<IUser>>(`SELECT * FROM users WHERE username='${username}';`)

        if (rowsUsers.length === 0) {
            throw new HTTPException(404, { message: 'User not found' })
        }

        const user = convertArrayToObject<IUser>(Object.values(rowsUsers[0]), ['id', 'username', 'email', 'password', 'role', 'created_at', 'updated_at'])

        const isMatch = await Bun.password.verify(password, String(user.password), 'bcrypt')

        if (!isMatch) {
            throw new HTTPException(401, { message: 'Invalid credenttials' })
        }

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
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e instanceof Error ? e.message : 'Internal Server Error' });
        } else {
            throw new HTTPException(500, { message: 'Internal Server Error' });
        }
    }
})

auth.get('/refresh', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    console.log('Decoded payload:', decodePayload)

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No  token provided' })
    }

    try {
        const payload = {
            username: decodePayload.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiration
            iat: Math.floor(Date.now() / 1000),
        }
        console.log('Refreshing token for user:', payload)
        const newToken = await sign(
            payload,
            process.env.SECRET_KEY || '',
        )
        console.log('New token generated:', newToken)
        return c.json({
            newToken,
        })
    } catch (e) {
        console.error('Error during token refresh:', e)
        throw new HTTPException(500, { message: e instanceof Error ? e.message : 'Internal Server Error' });
    }
})


export default auth