const { Pool } = require("pg")


module.exports = new Pool({
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || '123456',
    host: process.env.HOST || 'localhost',
    port: 5432,
    database: process.env.DATABASE || 'foodfy'

})