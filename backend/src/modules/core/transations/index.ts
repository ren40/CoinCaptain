import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { convertArrayToObject, paginate } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'
import { zValidator } from '@hono/zod-validator'
import dbClientInstance from '../../infrastructure/db'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'
import { bearerAuthConfig, getAuthUserId } from '../../middleware'
import { toHttpError } from '../../utils/errorHandler'
import { ITransation, ITransationScheme, ITransationKeys } from './types'
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


transations.post('/', zValidator('json', schemeNewTransations), bearerAuth(bearerAuthConfig), async (c) => {
  try {
    const newTransation: ITransationScheme = await c.req.json()
    if (JSON.stringify(newTransation) === '{}') throw new HTTPException(400, { message: 'Invalid transation data' })
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()
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
    throw toHttpError(e)
  }
})

transations.get('/', bearerAuth(bearerAuthConfig), async (c) => {
  try {
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()
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
    throw toHttpError(e)
  }
})

transations.get('/:id', bearerAuth(bearerAuthConfig), async (c) => {
  const { id } = c.req.param()
  try {
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()

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
    throw toHttpError(e)
  }
})

transations.put('/:id', zValidator('json', schemeUpdateTransations), bearerAuth(bearerAuthConfig), async (c) => {
  const transationId = c.req.param('id')
  try {
    const updateTransation = await c.req.json()
    if (!transationId) throw new HTTPException(400, { message: 'Transation ID is required' })
    if (JSON.stringify(updateTransation) === '{}') throw new HTTPException(400, { message: 'Invalid transation data' })
    const userID = await getAuthUserId(c)
        const dbClient = await dbClientInstance()
        if (!updateTransation.userID) {
            updateTransation.userID = userID
        }

        const result = await dbClient.request<Array<ITransation>>(`UPDATE transactions SET date = '${updateTransation.date}', description = '${updateTransation.description}', amount = ${updateTransation.amount}, category_id = ${updateTransation.categoryId}, is_income = ${updateTransation.isIncome} WHERE id = ${transationId} AND user_id = ${userID} RETURNING *;`)

    return c.json(204)
  } catch (e) {
    throw toHttpError(e)
  }
})

transations.delete('/:id', bearerAuth(bearerAuthConfig), async (c) => {
  const transationId = c.req.param('id')
  try {
    if (!transationId) throw new HTTPException(400, { message: 'Transation ID is required' })
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()
    await dbClient.request(`DELETE FROM transactions WHERE id = ${transationId} AND user_id = ${userID}`)
    return c.json(204)
  } catch (e) {
    throw toHttpError(e)
  }
})

export default transations
