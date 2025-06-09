import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { User, Auth, Transations } from './modules/core'
import dbClientInstance from './modules/infrastructure/db'

const app = new Hono().basePath('/api')
// app.use('api/*', cors({
//   origin: 'http://localhost:5173', // Allow requests from your frontend
//   allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
//   exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//   maxAge: 600,
//   credentials: true,
// }))
const MAX_RETRIES = Number.parseInt(process.env.MAX_RETRIES || '') || 5
const RETRY_INTERVAL_MS = Number.parseInt(process.env.RETRY_INTERVAL_MS || '') || 5000

async function initializeDatabase(retries = 0) {
  try {
    const dbClient = await dbClientInstance();
    await dbClient.connect();
    console.log('Database connected successfully');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Database connection failed: ${errorMessage}`);
    if (retries < MAX_RETRIES) {
      console.log(`Retrying to connect to the database... (${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL_MS));
      return initializeDatabase(retries + 1);
    } else {
      console.error('Max retries reached. Could not connect to the database.');
      throw error; // Пробрасываем ошибку дальше
    }
  }

}

initializeDatabase()

app.use('*', cors())

app.route('/login', Auth)
app.route('/user', User)
app.route('/transations', Transations)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// export default app
export default {
  port: 3100,
  fetch: app.fetch,
} 