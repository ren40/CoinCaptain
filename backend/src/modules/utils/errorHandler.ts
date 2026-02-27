import { HTTPException } from 'hono/http-exception'

const DEFAULT_MESSAGE = 'Internal server error'

/**
 * Преобразует пойманную ошибку в HTTPException для единообразной обработки в роутах.
 */
export function toHttpError(e: unknown): HTTPException {
  if (e instanceof HTTPException) return e
  console.error(e)
  const message = e instanceof Error ? e.message : DEFAULT_MESSAGE
  return new HTTPException(500, { message })
}
