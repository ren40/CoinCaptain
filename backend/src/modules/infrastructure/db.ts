import { SQL } from 'bun'

const db = new SQL({
    hostname: 'localhost',
    port: 5432,

    database: 'coin_captain',
    username: 'adminCaptain',
    password: 'Cejhjcnm1!',

    max: 20,
    idle_timeout: 30,
    max_lifetime: 0,
    connection_timeout: 30,
})

export default db