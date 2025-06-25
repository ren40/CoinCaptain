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
    color: z.string().optional()
}) as z.ZodType<ICategoryScheme>;

//POST
category.post('/', zValidator('json', schemeCategory), bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    try {
        const newCategory: ICategoryScheme = await c.req.json()
        const decodePayload = await c.get('jwtPayload')
        const dbClient = await dbClientInstance()

        if (!decodePayload) {
            throw new HTTPException(401, { message: 'No token provided' })
        }

        const userID = await getUserID(decodePayload.username)

        const result = await dbClient.request<Array<ICategory>>(`INSERT INTO categories (name, user_id) VALUES ('${newCategory.name}', '${userID}') RETURNING *;`)

        if (result.length === 0) {
            throw new HTTPException(500, { message: 'Failed to create category' })
        }

        const createdCategory: ICategory = {
            id: (result[0] as any[])[0],
            name: (result[0] as any[])[1],
        }
        return c.json({ ...createdCategory }, 201)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})


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
        console.log(rowsCategories)
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
category.delete('/:id', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const dbClient = await dbClientInstance()
    const categoryId = c.req.param('id')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (!categoryId || isNaN(Number(categoryId))) {
        throw new HTTPException(400, { message: 'Invalid category id' })
    }

    try {
        const userID = await getUserID(decodePayload.username)

        // Проверяем, существует ли категория и принадлежит ли пользователю
        const checkResult = await dbClient.request<Array<ICategory>>(
            `SELECT id FROM categories WHERE id = '${categoryId}' AND user_id = '${userID}';`
        )
        if (checkResult.length === 0) {
            return c.json({ message: 'Category not found' }, 404)
        }

        // Удаляем категорию
        await dbClient.request(
            `DELETE FROM categories WHERE id = '${categoryId}' AND user_id = '${userID}';`
        )

        return c.json({ message: 'Category deleted successfully' }, 200)
    } catch (e) {
        console.error(e)
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})


//PUT
category.put('/:id', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const dbClient = await dbClientInstance()
    const categoryId = c.req.param('id')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (!categoryId || isNaN(Number(categoryId))) {
        throw new HTTPException(400, { message: 'Invalid category id' })
    }

    let body: Partial<ICategoryScheme>
    try {
        body = await c.req.json()
    } catch (e) {
        throw new HTTPException(400, { message: 'Invalid JSON body' })
    }

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        throw new HTTPException(400, { message: 'Category name is required' })
    }

    try {
        const userID = await getUserID(decodePayload.username)

        // Проверяем, существует ли категория и принадлежит ли пользователю
        const checkResult = await dbClient.request<Array<ICategory>>(
            `SELECT id FROM categories WHERE id = '${categoryId}' AND user_id = '${userID}';`
        )
        if (checkResult.length === 0) {
            return c.json({ message: 'Category not found' }, 404)
        }

        // Обновляем категорию
        await dbClient.request(
            `UPDATE categories SET name = '${body.name}' WHERE id = '${categoryId}' AND user_id = '${userID}';`
        )

        // Получаем обновленную категорию
        const updatedResult = await dbClient.request<Array<ICategory>>(
            `SELECT id, name, user_id FROM categories WHERE id = '${categoryId}' AND user_id = '${userID}';`
        )

        if (updatedResult.length === 0) {
            return c.json({ message: 'Category not found after update' }, 404)
        }

        const updatedCategory: ICategory = {
            id: (updatedResult[0] as any[])[0],
            name: (updatedResult[0] as any[])[1],
            userId: (updatedResult[0] as any[])[2],
        }

        return c.json({ ...updatedCategory }, 200)
    } catch (e) {
        console.error(e)
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})


export default category