import { verify } from 'hono/jwt'
import { Context } from 'hono'


export const checkToken = async (c: Context, token?: string, ) => {
    if (!token) {
        return false
    }

    const decodedToken = await verify(token, Bun.env.SECRET_KEY || '')
    if (!decodedToken) {
        return false
    }

    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        return false
    }

    c.set('jwtPayload', decodedToken)
    return true
}