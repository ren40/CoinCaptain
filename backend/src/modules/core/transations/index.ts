import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { checkToken } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'
import { zValidator } from '@hono/zod-validator'
import db from '../../infrastructure/db'

import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

import { ITransation, ITransationScheme } from './types'

const transations = new Hono()

transations.use(logger())

const scheme = z.object({
    description: z.string().min(1, { message: 'Description is required' }),
    amount: z.number().min(0, { message: 'Amount must be a positive number' }),
    categoryId: z.number().int().positive({ message: 'Category ID must be a positive integer' }),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Date must be a valid date string',
    }),
    isIncome: z.boolean().optional(),
})

transations.post('/', zValidator('json', scheme), bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const newTransation: ITransationScheme = await c.req.json()
    const decodePayload = await c.get('jwtPayload')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (JSON.stringify(newTransation) === '{}') {
        throw new HTTPException(400, { message: 'Invalid transation data' })
    }

    const connection = await db.connect()
    const rowsUsers = await connection`SELECT * FROM users WHERE username = ${decodePayload.username}`.values()
    if (rowsUsers.length === 0) {
        throw new HTTPException(404, { message: 'User not found' })
    }

    const userID = rowsUsers[0][0]

    try {
        const result = await connection`INSERT INTO transactions (user_id, date, description, amount, category_id) VALUES (${userID}, ${newTransation.date}, ${newTransation.description}, ${newTransation.amount}, ${newTransation.categoryId}) RETURNING *`.values()

        if (result.length === 0) {
            throw new HTTPException(500, { message: 'Failed to create transation' })
        }

        const createdTransation: ITransation = {
            id: result[0][0],
            date: result[0][2],
            description: result[0][3],
            amount: result[0][4],
            categoryId: result[0][5],
            isIncome: result[0][6],
            balance: result[0][7],
            createdAt: result[0][8]
        }

        return c.json({ ...createdTransation }, 201)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }

})

transations.get('/', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    // TODO: Надо сделать пагинацию
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
            categoryId: row[5],
            isIncome: row[6],
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

transations.get('/:id', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const { id } = c.req.param()
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

        const rowsTransations = await connection`SELECT * FROM transactions WHERE user_id = ${userID} AND id = ${id}`.values()
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
            categoryId: row[5],
            isIncome: row[6],
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

transations.delete('/:id', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const transationId = c.req.param('id')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (!transationId) {
        throw new HTTPException(400, { message: 'Transation ID is required' })
    }

    try {
        const userName = decodePayload.username
        const connection = await db.connect()

        const rowsUsers = await connection`SELECT * FROM users WHERE username = ${userName}`.values()
        if (rowsUsers.length === 0) {
            throw new HTTPException(404, { message: 'User not found' })
        }

        const userID = rowsUsers[0][0]

        const result = await connection`DELETE FROM transactions WHERE id = ${transationId} AND user_id = ${userID}`.values()

        if (result.length === 0) {
            throw new HTTPException(404, { message: 'Transation not found' })
        }

        return c.json(204)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }

})

export default transations
