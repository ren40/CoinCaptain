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


app.post('/register', async (c) => {
    return c.json({
        ok: true,
        message: 'User registered successfully'
    })
})

export default app