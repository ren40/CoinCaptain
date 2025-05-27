import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { getCookie } from 'hono/cookie'
import { sign, decode } from 'hono/jwt'

import db from '../../infrastructure/db'

import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

import { ITransation } from './types'

const transations = new Hono()

transations.use(logger())

const scheme = z.object({

})

transations.post()

transations.get('/', async (c) => {
    const cookieToken = await getCookie(c, 'token')

    if (!cookieToken) {
        throw new HTTPException(401, { message: 'No  token provided' })
    }
    
    try {
        const decodedToken = decode(cookieToken)

        const userName = decodedToken.payload.username
        const connection = await db.connect()

        const rowsTransations = await connection`SELECT * FROM transations WHERE username = ${userName}`.values()
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
