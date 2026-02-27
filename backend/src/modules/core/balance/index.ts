import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { convertArrayToObject } from '../../utils'
import { bearerAuth } from 'hono/bearer-auth'
import dbClientInstance from '../../infrastructure/db'
import { bearerAuthConfig, getAuthUserId } from '../../middleware'
import { toHttpError } from '../../utils/errorHandler'
import { IBalance, BalanceKeys } from './types'

const balance = new Hono()
balance.use(logger())

// Получение текущего баланса пользователя
balance.get('/current', bearerAuth(bearerAuthConfig), async (c) => {
  try {
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()
        
        // Получаем текущий месяц
        const currentMonth = new Date()
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
        
        // Получаем баланс за текущий месяц
        const balanceResult = await dbClient.request<Array<IBalance>>(`
            SELECT id, balance_date, balance_amount, user_id
            FROM balance 
            WHERE user_id = ${userID} 
            AND DATE_TRUNC('month', balance_date) = DATE_TRUNC('month', CURRENT_DATE)
            ORDER BY balance_date DESC
            LIMIT 1
        `) as IBalance[][]

        if (balanceResult.length === 0) {
            // Если записи нет, вычисляем баланс из транзакций
            const transactionSumResult = await dbClient.request<Array<{ total: number }>>(`
                SELECT COALESCE(SUM(
                    CASE 
                        WHEN is_income THEN amount 
                        ELSE -amount 
                    END
                ), 0) as total
                FROM transactions 
                WHERE user_id = ${userID} 
                AND date >= '${startOfMonth.toISOString().split('T')[0]}' 
                AND date <= '${endOfMonth.toISOString().split('T')[0]}'
            `) as any[][]

            const currentBalance = Number(transactionSumResult[0]?.[0] || 0)
            
            return c.json({
                balance: {
                    id: null,
                    balanceDate: startOfMonth.toISOString(),
                    balanceAmount: currentBalance,
                    userId: userID
                }
            })
        }

        const balance = convertArrayToObject<IBalance>(Object.values(balanceResult[0]), BalanceKeys)

    return c.json({ balance })
  } catch (e) {
    throw toHttpError(e)
  }
})

// Получение истории баланса пользователя
balance.get('/history', bearerAuth(bearerAuthConfig), async (c) => {
  try {
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()
        const limit = Number.parseInt(c.req.query('limit') || '12') // По умолчанию 12 месяцев
        
        const balanceHistoryResult = await dbClient.request<Array<IBalance>>(`
            SELECT id, balance_date, balance_amount, user_id
            FROM balance 
            WHERE user_id = ${userID}
            ORDER BY balance_date DESC
            LIMIT ${limit}
        `) as IBalance[][]

        if (balanceHistoryResult.length === 0) {
            return c.json({
                balanceHistory: []
            })
        }

        const balanceHistory = balanceHistoryResult.map((row: any) => {
            return convertArrayToObject<IBalance>(Object.values(row), BalanceKeys)
        }) as unknown as IBalance[]

    return c.json({ balanceHistory })
  } catch (e) {
    throw toHttpError(e)
  }
})

// Получение баланса за конкретный месяц
balance.get('/month/:year/:month', bearerAuth(bearerAuthConfig), async (c) => {
  const { year, month } = c.req.param()
  try {
    const userID = await getAuthUserId(c)
    const dbClient = dbClientInstance()
        const targetDate = `${year}-${month.padStart(2, '0')}-01`
        
        const balanceResult = await dbClient.request<Array<IBalance>>(`
            SELECT id, balance_date, balance_amount, user_id
            FROM balance 
            WHERE user_id = ${userID} 
            AND DATE_TRUNC('month', balance_date) = DATE_TRUNC('month', '${targetDate}'::date)
            ORDER BY balance_date DESC
            LIMIT 1
        `) as IBalance[][]

        if (balanceResult.length === 0) {
            // Если записи нет, вычисляем баланс из транзакций
            const startOfMonth = new Date(Number(year), Number(month) - 1, 1)
            const endOfMonth = new Date(Number(year), Number(month), 0)
            
            const transactionSumResult = await dbClient.request<Array<{ total: number }>>(`
                SELECT COALESCE(SUM(
                    CASE 
                        WHEN is_income THEN amount 
                        ELSE -amount 
                    END
                ), 0) as total
                FROM transactions 
                WHERE user_id = ${userID} 
                AND date >= '${startOfMonth.toISOString().split('T')[0]}' 
                AND date <= '${endOfMonth.toISOString().split('T')[0]}'
            `) as any[][]

            const monthBalance = Number(transactionSumResult[0]?.[0] || 0)
            
            return c.json({
                balance: {
                    id: null,
                    balanceDate: startOfMonth.toISOString(),
                    balanceAmount: monthBalance,
                    userId: userID
                }
            })
        }

        const balance = convertArrayToObject<IBalance>(Object.values(balanceResult[0]), BalanceKeys)

    return c.json({ balance })
  } catch (e) {
    throw toHttpError(e)
  }
})

export default balance 