import { Context } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { HTTPException } from 'hono/http-exception'
import { checkToken } from '../utils'
import { getUserID } from '../utils/getUserID'

/** Конфигурация bearer-аутентификации для защищённых роутов */
export const bearerAuthConfig = {
  verifyToken: async (token: string, c: Context) => checkToken(c, token),
}

/**
 * Возвращает ID текущего пользователя из контекста (после bearerAuth).
 * Выбрасывает 401, если токен отсутствует или пользователь не найден.
 */
export async function getAuthUserId(c: Context): Promise<number> {
  const payload = c.get('jwtPayload')
  if (!payload || typeof (payload as { username?: string }).username !== 'string') {
    throw new HTTPException(401, { message: 'No token provided' })
  }
  return getUserID((payload as { username: string }).username)
}
