import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { checkToken, convertArrayToObject, paginate, getUserID } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'
import { zValidator } from '@hono/zod-validator'
import dbClientInstance from '../../infrastructure/db'

import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

import { ITransation, ITransationScheme } from './types'

import { ITransationKeys } from './types'
import category from './category'

const transations = new Hono()

transations.use(logger())
transations.route('/category', category)

const schemeNewTransations = z.object({
    description: z.string().min(1, { message: 'Description is required' }),
    amount: z.number(),
    categoryId: z.optional(z.number()),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Date must be a valid date string',
    }),
    isIncome: z.boolean().optional(),
})

const schemeUpdateTransations = z.object({
    userID: z.number().optional(),
}).merge(schemeNewTransations)


transations.post('/', zValidator('json', schemeNewTransations), bearerAuth({
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

    const dbClient = await dbClientInstance()
    const userID = await getUserID(decodePayload.username)

    try {
        const result = await dbClient.request<Array<ITransation>>(`INSERT INTO transactions (user_id, date, description, amount, category_id, is_income) VALUES ('${userID}', '${newTransation.date}', '${newTransation.description}', '${newTransation.amount}', '${newTransation.categoryId}', '${newTransation.isIncome}') RETURNING *;`)

        if (result.length === 0) {
            throw new HTTPException(500, { message: 'Failed to create transation' })
        }

        const createdTransation: ITransation = {
            id: (result[0] as any[])[0],
            date: (result[0] as any[])[2],
            description: (result[0] as any[])[3],
            amount: Number((result[0] as any[])[4]),
            categoryId: (result[0] as any[])[5],
            isIncome: (result[0] as any[])[6],
            balance: (result[0] as any[])[7],
            createdAt: (result[0] as any[])[8]
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
    const dbClient = await dbClientInstance()

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No  token provided' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const currentPage = Number.parseInt(c.req.query('currentPage') || '')
        const sizeItemsView = Number.parseInt(c.req.query('sizeItemsView') || '')
        const filter = c.req.query('filter') || ''

        let query = `SELECT id, date, description, amount, category_id, is_income, created_at FROM transactions WHERE user_id = '${userID}' `

        if (filter) {
            const filterArr = filter.split('&')
            filterArr.forEach((item) => {
                if (item.includes('=')) {
                    const [key, value] = item.split('=')
                    if (key === 'month') {
                        if (value === 'current') {
                            query += `AND date >= DATE_TRUNC('month', CURRENT_DATE) AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' `
                        } else if (value === 'all') {
                            query += `AND date >= '2000-01-01' `
                        } else {
                            query += `AND date >= '${value}-01' AND date < '${value}-31' `
                        }
                    }
                    if (key === 'search') {
                        if (value) {
                            query += `AND description ILIKE '%${value}%' `
                        } else {
                            query += `AND description ILIKE '%%' `
                        }
                    }
                }
            })
        }

        const rowsTransations = await dbClient.request<Array<ITransation>>(query) as ITransation[][]

        if (rowsTransations.length === 0) {
            return c.json({
                transations: []
            })
        }

        const transations = rowsTransations.map((row: any) => {
            const transaction = convertArrayToObject<ITransation>(Object.values(row), ITransationKeys)
            return transaction
        }) as unknown as ITransation[]

        let paginateArr = paginate(transations, currentPage, sizeItemsView)
        const pageCount = Math.ceil(transations.length / sizeItemsView)

        return c.json({
            transations: paginateArr,
            currentPage,
            sizeItemsView,
            pageCount,
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
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        const rowsTransations = await dbClient.request<Array<ITransation>>(`SELECT  id, date, description, amount, category_id, is_income, created_at  FROM transactions WHERE user_id = ${userID} AND id = ${id}`)
        if (rowsTransations.length === 0) {
            return c.json({
                transations: []
            })
        }

        const transations = convertArrayToObject<ITransation>(Object.values(rowsTransations[0]), ITransationKeys)
        if (!transations) {
            return c.json({
                transations: []
            })
        }

        return c.json(transations, 200)

    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})

transations.put('/:id', zValidator('json', schemeUpdateTransations), bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const transationId = c.req.param('id')
    const updateTransation = await c.req.json()

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (!transationId) {
        throw new HTTPException(400, { message: 'Transation ID is required' })
    }

    if (JSON.stringify(updateTransation) === '{}') {
        throw new HTTPException(400, { message: 'Invalid transation data' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()
        if (!updateTransation.userID) {
            updateTransation.userID = userID
        }

        const result = await dbClient.request<Array<ITransation>>(`UPDATE transactions SET date = '${updateTransation.date}', description = '${updateTransation.description}', amount = ${updateTransation.amount}, category_id = ${updateTransation.categoryId}, is_income = ${updateTransation.isIncome} WHERE id = ${transationId} AND user_id = ${userID} RETURNING *;`)

        console.log(result)

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
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        await dbClient.request(`DELETE FROM transactions WHERE id = ${transationId} AND user_id = ${userID}`)

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
