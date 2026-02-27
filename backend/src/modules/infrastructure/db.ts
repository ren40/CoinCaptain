import { SQL } from 'bun'

interface IDBClient {
    db: SQL
    connect: () => Promise<SQL>
    /** Выполняет сырой SQL (без экранирования). Использовать только для доверенных данных. */
    request: <T>(query: string) => Promise<T | T[]>
    /** Безопасный запрос с параметрами через tagged template (защита от SQL injection). */
    query: <T = unknown>(strings: TemplateStringsArray, ...values: unknown[]) => Promise<T[]>
    close: () => Promise<void>
}

let dbClient: DBClient | null = null

class DBClient implements IDBClient {
    db: SQL
    private connection: Awaited<ReturnType<SQL['connect']>> | null = null

    constructor() {
        this.db = new SQL({
            hostname: process.env.HOST || 'localhost',
            port: Number.parseInt(process.env.PORT || '5432'),
            database: process.env.DATABASE || 'postgresql_db',
            username: process.env.USER || 'postgres',
            password: process.env.PASSWORD || 'postgres',
            max: 20,
            idle_timeout: 30,
            max_lifetime: 0,
            connection_timeout: 30,
        })
    }

    async request<T>(query: string): Promise<T | T[]> {
        await this.ensureConnection()
        if (!this.connection) throw new Error('Database connection is not established')
        console.log('Executing query:', query)
        const result = await this.connection.unsafe(query).values()
        return result as T | T[]
    }

    async query<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
        await this.ensureConnection()
        const tag = this.db as (s: TemplateStringsArray, ...v: unknown[]) => { values(): Promise<unknown[]> }
        const q = tag(strings, ...values)
        const rows = await q.values()
        return rows as T[]
    }

    private async ensureConnection() {
        if (!this.connection) {
            this.connection = await this.db.connect()
            if (!this.connection) throw new Error('Failed to connect to the database')
        }
    }

    async close() {
        try {
            await this.db.close()
        } catch (error) {
            console.error('Error closing the database connection:', error)
        } finally {
            this.connection = null
        }
    }

    async connect() {
        await this.ensureConnection()
        return this.connection!
    }
}

export default function dbClientInstance(): DBClient {
    if (!dbClient) {
        dbClient = new DBClient();
    }
    return dbClient;
}