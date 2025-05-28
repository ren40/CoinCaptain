import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { checkToken } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'

import db from '../../infrastructure/db'

import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

import { ITransation } from './types'

const transations = new Hono()

transations.use(logger())

const scheme = z.object({

})

transations.post()

transations.get('/', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No  token provided' })
    }

    try {
        const userName = decodePayload.username
        const connection = await db.connect()

        const rowsUsers = await connection`SELECT * FROM users WHERE username = ${userName}`.values()
        if (rowsUsers.length === 0) {
            throw new HTTPException(404, { message: 'User not found' })
        }

        const userID = rowsUsers[0][0]

        const rowsTransations = await connection`SELECT * FROM transactions WHERE user_id = ${userID}`.values()
        if (rowsTransations.length === 0) {
            return c.json({
                transations: []
            })
        }

        const transations: Array<ITransation> = rowsTransations.map((row: any[]) => ({
            id: row[0],
            date: row[2],
            description: row[3],
            amount: row[4],
            categoryId: row[5]
        }))

        return c.json({
            transations
        })
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})

transations.patch()

transations.put()

transations.delete()

export default transations
