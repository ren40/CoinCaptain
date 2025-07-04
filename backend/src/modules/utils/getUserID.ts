import { HTTPException } from 'hono/http-exception'
import dbClientInstance from '../infrastructure/db'
import { IUser } from '../../types'
import { convertArrayToObject } from './convertArrayToObject'

export const getUserID = async (username: string) => {
    try {
        const dbClient = await dbClientInstance()
        const rowsUsers = await dbClient.request<Array<IUser>>(`SELECT * FROM users WHERE username = '${username}';`)

        if (rowsUsers.length === 0) {
            throw new HTTPException(404, { message: 'User not found' })
        }

        const userID = convertArrayToObject<IUser>(Object.values(rowsUsers[0]), ['id', 'username', 'email', 'password', 'role', 'created_at', 'updated_at'])
        return userID.id
    } catch (e) {
        console.error(e);
        if (e instanceof Error) {
            throw new HTTPException(500, { message: e.message })
        } else {
            throw new HTTPException(500, { message: 'Internal server error' })
        }
    }

}