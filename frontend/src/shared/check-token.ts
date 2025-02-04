import { jwtDecode} from 'jwt-decode'

export function checkJWT(token: string | null) {
    if (!token) return false

    try {
        const decodedToken = jwtDecode(token)

        const currentTime = new Date().getTime()

        if(typeof decodedToken === 'object') {
            const exp = decodedToken?.exp ?? 0
            if (exp < currentTime) {
                return false
            }
        }

        return true
    } catch (err) {
        throw new Error('Ошибка чтения токена' + err)
    }
}