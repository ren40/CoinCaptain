import { SQL } from 'bun'

interface IDBClient {
    db: SQL,
    conncetion?: SQL,
    connect: () => Promise<SQL>,
    request: <T>(query: string, params?: any[]) => Promise<T | T[]>,
    close: () => Promise<void>
}

let dbClient: DBClient | null = null;
class DBClient implements IDBClient {
    db: SQL;
    conncetion?: SQL
    constructor() {
        this.db = new SQL({
            hostname: process.env.HOST || 'localhost',
            port: Number.parseInt(process.env.PORT || '5432'),

            database: process.env.DATABASE || 'postgres',
            username: process.env.USER || 'postgres',
            password: process.env.PASSWORD || 'postgres',

            max: 20,
            idle_timeout: 30,
            max_lifetime: 0,
            connection_timeout: 30,
        })
    }

    async request <T>(query: string): Promise<T | T[]> {
        try {
            if (!this.conncetion) {
                await this.connect();
            }

            if (!this.conncetion) {
                throw new Error('Database connection is not established');
            }
            console.log('Executing query:', query);
            const result = await this.conncetion.unsafe(`${query}`).values()

            return result as T | T[];
        } catch (error) {
            console.error('Error executing query:', error);
            throw error;
        }
    }

    async close() {
        try {
            await this.db.close();
        } catch (error) {
            console.error('Error closing the database connection:', error);
        }
    }

    async connect() {
        this.conncetion = await this.db.connect()
        if (!this.conncetion) {
            throw new Error('Failed to connect to the database');
        }
        return this.conncetion
    }
}

export default function dbClientInstance(): DBClient {
    if (!dbClient) {
        dbClient = new DBClient();
    }
    return dbClient;
}