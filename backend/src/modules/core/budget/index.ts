import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { checkToken, convertArrayToObject, getUserID } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'
import { zValidator } from '@hono/zod-validator'
import dbClientInstance from '../../infrastructure/db'

import { z } from 'zod'
import { HTTPException } from 'hono/http-exception'

import { IBudget, IBudgetScheme, IBudgetUpdateScheme, IBudgetKeys, IBudgetStats } from './types'

const budget = new Hono()

budget.use(logger())

const schemeNewBudget = z.object({
    amount: z.number().positive({ message: 'Amount must be positive' }),
    period: z.enum(['weekly', 'monthly', 'yearly'], { message: 'Period must be weekly, monthly, or yearly' }),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Start date must be a valid date string',
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'End date must be a valid date string',
    }),
    isActive: z.boolean().optional().default(true),
})

const schemeUpdateBudget = z.object({
    amount: z.any().optional(),
    period: z.enum(['weekly', 'monthly', 'yearly'], { message: 'Period must be weekly, monthly, or yearly' }).optional(),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Start date must be a valid date string',
    }).optional(),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'End date must be a valid date string',
    }).optional(),
    isActive: z.boolean().optional(),
})

// Создание нового бюджета
budget.post('/', zValidator('json', schemeNewBudget), bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const newBudget: IBudgetScheme = await c.req.json()
    const decodePayload = await c.get('jwtPayload')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (JSON.stringify(newBudget) === '{}') {
        throw new HTTPException(400, { message: 'Invalid budget data' })
    }

    const dbClient = await dbClientInstance()
    const userID = await getUserID(decodePayload.username)

    try {
        // Деактивируем все существующие бюджеты пользователя
        await dbClient.request(`UPDATE budgets SET is_active = false WHERE user_id = ${userID}`)

        const result = await dbClient.request<Array<IBudget>>(`
            INSERT INTO budgets (user_id, amount, period, start_date, end_date, is_active) 
            VALUES (${userID}, ${newBudget.amount}, '${newBudget.period}', '${newBudget.startDate}', '${newBudget.endDate}', ${newBudget.isActive}) 
            RETURNING *
        `)

        if (result.length === 0) {
            throw new HTTPException(500, { message: 'Failed to create budget' })
        }

        const createdBudget: IBudget = {
            id: (result[0] as any[])[0],
            userId: (result[0] as any[])[1],
            amount: Number((result[0] as any[])[2]),
            period: (result[0] as any[])[3],
            startDate: (result[0] as any[])[4],
            endDate: (result[0] as any[])[5],
            isActive: (result[0] as any[])[6],
            createdAt: (result[0] as any[])[7],
            updatedAt: (result[0] as any[])[8]
        }

        return c.json({ ...createdBudget }, 201)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})

// Получение всех бюджетов пользователя
budget.get('/', bearerAuth({
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
        const rowsBudgets = await dbClient.request<Array<IBudget>>(`
            SELECT id, user_id, amount, period, start_date, end_date, is_active, created_at, updated_at 
            FROM budgets 
            WHERE user_id = ${userID}
            ORDER BY created_at DESC
        `) as IBudget[][]

        if (rowsBudgets.length === 0) {
            return c.json({
                budgets: []
            })
        }

        const budgets = rowsBudgets.map((row: any) => {
            const budget = convertArrayToObject<IBudget>(Object.values(row), IBudgetKeys)
            return budget
        }) as unknown as IBudget[]

        return c.json({
            budgets
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

// Получение активного бюджета пользователя
budget.get('/active', bearerAuth({
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
        const rowsBudgets = await dbClient.request<Array<IBudget>>(`
            SELECT id, user_id, amount, period, start_date, end_date, is_active, created_at, updated_at 
            FROM budgets 
            WHERE user_id = ${userID} AND is_active = true
            ORDER BY created_at DESC
            LIMIT 1
        `) as IBudget[][]

        if (rowsBudgets.length === 0) {
            return c.json({
                budget: null
            })
        }

        const budget = convertArrayToObject<IBudget>(Object.values(rowsBudgets[0]), IBudgetKeys)

        return c.json({
            budget
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

// Получение конкретного бюджета по ID
budget.get('/:id', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const { id } = c.req.param()
    const decodePayload = await c.get('jwtPayload')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        const rowsBudgets = await dbClient.request<Array<IBudget>>(`
            SELECT id, user_id, amount, period, start_date, end_date, is_active, created_at, updated_at 
            FROM budgets 
            WHERE user_id = ${userID} AND id = ${id}
        `) as IBudget[][]

        if (rowsBudgets.length === 0) {
            return c.json({
                budget: null
            })
        }

        const budget = convertArrayToObject<IBudget>(Object.values(rowsBudgets[0]), IBudgetKeys)

        return c.json({
            budget
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

// Обновление бюджета
budget.put('/:id', zValidator('json', schemeUpdateBudget), bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const budgetId = c.req.param('id')
    const updateBudget = await c.req.json()

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (!budgetId) {
        throw new HTTPException(400, { message: 'Budget ID is required' })
    }

    if (JSON.stringify(updateBudget) === '{}') {
        throw new HTTPException(400, { message: 'Invalid budget data' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        // Проверяем, что бюджет принадлежит пользователю
        const existingBudget = await dbClient.request<Array<IBudget>>(`
            SELECT id FROM budgets WHERE user_id = ${userID} AND id = ${budgetId}
        `)

        if (existingBudget.length === 0) {
            throw new HTTPException(404, { message: 'Budget not found' })
        }

        // Формируем SQL для обновления
        const updateFields = []

        if (updateBudget.amount !== undefined) {
            updateFields.push(`amount = ${parseInt(updateBudget.amount)}`)
        }
        if (updateBudget.period !== undefined) {
            updateFields.push(`period = '${updateBudget.period}'`)
        }
        if (updateBudget.startDate !== undefined) {
            updateFields.push(`start_date = '${updateBudget.startDate}'`)
        }
        if (updateBudget.endDate !== undefined) {
            updateFields.push(`end_date = '${updateBudget.endDate}'`)
        }
        if (updateBudget.isActive !== undefined) {
            updateFields.push(`is_active = ${updateBudget.isActive}`)
        }

        updateFields.push('updated_at = CURRENT_TIMESTAMP')
        console.log(updateBudget)

        const result = await dbClient.request<Array<IBudget>>(`
            UPDATE budgets 
            SET ${updateFields.join(', ')}
            WHERE user_id = ${userID} AND id = ${budgetId}
            RETURNING *
        `)

        if (result.length === 0) {
            throw new HTTPException(500, { message: 'Failed to update budget' })
        }

        const updatedBudget: IBudget = {
            id: (result[0] as any[])[0],
            userId: (result[0] as any[])[1],
            amount: Number((result[0] as any[])[2]),
            period: (result[0] as any[])[3],
            startDate: (result[0] as any[])[4],
            endDate: (result[0] as any[])[5],
            isActive: (result[0] as any[])[6],
            createdAt: (result[0] as any[])[7],
            updatedAt: (result[0] as any[])[8]
        }

        return c.json({ ...updatedBudget }, 200)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})

// Удаление бюджета
budget.delete('/:id', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')
    const budgetId = c.req.param('id')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    if (!budgetId) {
        throw new HTTPException(400, { message: 'Budget ID is required' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        // Проверяем, что бюджет принадлежит пользователю
        const existingBudget = await dbClient.request<Array<IBudget>>(`
            SELECT id FROM budgets WHERE user_id = ${userID} AND id = ${budgetId}
        `)

        if (existingBudget.length === 0) {
            throw new HTTPException(404, { message: 'Budget not found' })
        }

        await dbClient.request(`DELETE FROM budgets WHERE user_id = ${userID} AND id = ${budgetId}`)

        return c.json({ message: 'Budget deleted successfully' }, 200)
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})



// Получение статистики активного бюджета
budget.get('/active/stats', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const decodePayload = await c.get('jwtPayload')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        // Получаем активный бюджет
        const budgetResult = await dbClient.request<Array<IBudget>>(`
            SELECT id, user_id, amount, period, start_date, end_date, is_active, created_at, updated_at 
            FROM budgets 
            WHERE user_id = ${userID} AND is_active = true
            ORDER BY created_at DESC
            LIMIT 1
        `) as IBudget[][]

        if (budgetResult.length === 0) {
            return c.json({
                stats: null
            })
        }

        const budget = convertArrayToObject<IBudget>(Object.values(budgetResult[0]), IBudgetKeys) as unknown as IBudget
        let startDate = new Date(budget.startDate)
        let endDate = new Date(budget.endDate)
        console.log(startDate.toISOString().split('T')[0])
        // Получаем сумму расходов за период бюджета
        const spentResult = await dbClient.request<Array<{ total: number }>>(`
            SELECT COALESCE(SUM(amount), 0) as total
            FROM transactions 
            WHERE user_id = ${userID} 
            AND is_income = false 
            AND date >= '${startDate.toISOString().split('T')[0]}' 
            AND date <= '${endDate.toISOString().split('T')[0]}'
        `) as any[][]

        const spentAmount = Number(spentResult[0]?.[0] || 0)
        const remainingAmount = Math.max(0, budget.amount - spentAmount)
        const spentPercentage = budget.amount > 0 ? Math.min(100, (spentAmount / budget.amount) * 100) : 0

        const stats: IBudgetStats = {
            budgetAmount: budget.amount,
            spentAmount,
            remainingAmount,
            spentPercentage: Math.round(spentPercentage * 100) / 100,
            period: budget.period,
            startDate: budget.startDate,
            endDate: budget.endDate,
        }

        return c.json({ stats })
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})


// Получение статистики бюджета
budget.get('/:id/stats', bearerAuth({
    verifyToken: async (token, c) => {
        return await checkToken(c, token)
    },
}), async (c) => {
    const { id } = c.req.param()
    const decodePayload = await c.get('jwtPayload')

    if (!decodePayload) {
        throw new HTTPException(401, { message: 'No token provided' })
    }

    try {
        const userID = await getUserID(decodePayload.username)
        const dbClient = await dbClientInstance()

        // Получаем бюджет
        const budgetResult = await dbClient.request<Array<IBudget>>(`
            SELECT id, user_id, amount, period, start_date, end_date, is_active, created_at, updated_at 
            FROM budgets 
            WHERE user_id = ${userID} AND id = ${id}
        `) as IBudget[][]

        if (budgetResult.length === 0) {
            throw new HTTPException(404, { message: 'Budget not found' })
        }

        const budget = convertArrayToObject<IBudget>(Object.values(budgetResult[0]), IBudgetKeys) as unknown as IBudget

        // Получаем сумму расходов за период бюджета
        const spentResult = await dbClient.request<Array<{ total: number }>>(`
            SELECT COALESCE(SUM(amount), 0) as total
            FROM transactions 
            WHERE user_id = ${userID} 
            AND is_income = false 
            AND date >= '${budget.startDate}' 
            AND date <= '${budget.endDate}'
        `) as any[][]

        const spentAmount = Number(spentResult[0]?.[0] || 0)
        const remainingAmount = Math.max(0, budget.amount - spentAmount)
        const spentPercentage = budget.amount > 0 ? Math.min(100, (spentAmount / budget.amount) * 100) : 0

        const stats: IBudgetStats = {
            budgetAmount: budget.amount,
            spentAmount,
            remainingAmount,
            spentPercentage: Math.round(spentPercentage * 100) / 100,
            period: budget.period,
            startDate: budget.startDate,
            endDate: budget.endDate,
        }

        return c.json({ stats })
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }
})

export default budget
