const db = require('../../config/db')
const { age, date, graduation } = require('../../lib/utils')

module.exports = {
    all() {

        const query = `
            SELECT *
            FROM users
            ORDER BY name ASC
            `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    create(data) {
        const query = `
            INSERT INTO users (
                name,
                email,
                password,
                is_admin
                ) VALUES ($1,$2,$3,$4) 
                RETURNING id
                `
        const values = [
            data.name,
            data.email,
            data.password,
            data.is_admin || 0
        ]

        try {
            return db.query(query, values)
        } catch (err) {
            console.error(err)
        }


    },
    find(id) {
        const query = `
            SELECT chefs.*, COUNT (recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id=${id}
            GROUP BY chefs.id 
            `
        try {
            return db.query(query)
        } catch (err) {
            console.error("ERR " + err)
        }


    },
    async findOne(filters) {
        let query = `SELECT * FROM users`

        Object.keys(filters).map(key => {
            query = `${query} ${key}`
            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            })
        })
        try {
            const results = await db.query(query)
            return results.rows[0]
        } catch (err) {
            console.error(err)
        }
    },
    update(id, fields) {
        let query = `
        UPDATE users SET
    `
        try {
            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                    ${key} = '${fields[key]}',
                    `
                } else {
                    query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                    `
                }
            })

            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    delete(id) {
        const query = `DELETE FROM users WHERE id = ${id} `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    }

}