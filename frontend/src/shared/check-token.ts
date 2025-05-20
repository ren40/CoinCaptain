import { jwtDecode } from 'jwt-decode'

export function checkJWT(token: string | null) {
    if (!token) return false

    try {
        const decodedToken = jwtDecode<{ exp?: number }>(token)
        const currentTime = new Date().getTime()

        if (typeof decodedToken === 'object') {
            const exp = decodedToken?.exp;
            if (typeof exp !== 'number') {
                console.error('Invalid exp value in token:', exp);
                return false;
            }

            if (exp * 1000 < currentTime) {
                console.log('Token expired')
                return false
            }
        }

        return true
    } catch (err) {
        throw new Error('Error reading token: ' + err)
    }
}