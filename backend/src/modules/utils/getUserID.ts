import { HTTPException } from 'hono/http-exception'
import dbClientInstance from '../infrastructure/db'
import { IUser } from '../../types'
import { convertArrayToObject } from './convertArrayToObject'
import { toHttpError } from './errorHandler'

const UserKeys = ['id', 'username', 'email', 'password', 'role', 'created_at', 'updated_at'] as const

export async function getUserID(username: string): Promise<number> {
  try {
    const dbClient = dbClientInstance()
    const rows = await dbClient.query<unknown[]>`SELECT * FROM users WHERE username = ${username}`

    if (rows.length === 0) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    const user = convertArrayToObject<IUser>(
      Object.values(rows[0] as unknown[]),
      [...UserKeys]
    ) as unknown as IUser & { id: number }
    return user.id
  } catch (e) {
    throw toHttpError(e)
  }
}
