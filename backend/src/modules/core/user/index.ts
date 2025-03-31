import { Hono } from 'hono'

interface User {
    name: string,
    login: string,
    password_hash: string,
}

const app = new Hono()

app.get(
    '/',
    (c) => {
        return c.json({
            ok: true,
            message: 'Hello world'
        })
    }
)


export default app