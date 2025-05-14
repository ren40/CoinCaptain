import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { User, Auth } from './modules/core'
import db from './modules/infrastructure/db'

const app = new Hono()
// app.use('api/*', cors({
//   origin: 'http://localhost:5173', // Allow requests from your frontend
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
//   exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//   maxAge: 600,
//   credentials: true,
// }))
db.connect()
app.use('api/*', cors())

app.route('api/login', Auth)
app.route('api/user', User)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// export default app
export default {
  port: 3100,
  fetch: app.fetch,
} 