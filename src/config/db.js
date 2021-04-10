const { Pool } = require("pg")

const connectionString = process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/foodfy"

console.log(connectionString)
module.exports = new Pool({
    connectionString,
    dialect: "postgres",
    logging: true,
    define: {
        timestamps: true
    }
    /*,
    ssl: { rejectUnauthorized: false }
    */


})