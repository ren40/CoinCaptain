import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { checkToken, convertArrayToObject, paginate, getUserID } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'
import { zValidator } from '@hono/zod-validator'
import dbClientInstance from '../../infrastructure/db'
import { ICategory, ICategoryScheme, ICategoryKeys } from './types'
import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

const category = new Hono()

category.use(logger())

const schemeCategory = z.object({
    name: z.string(),
    userId: z.number()
})

//POST



//GET
category.get('/', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const dbClient = await dbClientInstance()

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const rowsCategories = await dbClient.request<Array<ICategory>>(`SELECT id, name FROM categories WHERE user_id = '${userID}';`)

        if (rowsCategories.length === 0) {
            return c.json({ message: 'No categories found' }, 404)
        }

        const categories = rowsCategories.map((category) => convertArrayToObject<ICategory>(Object.values(category), ICategoryKeys))
        return c.json(categories, 200)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }


})

//DELETE


//PUT


export default category