const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all(callback) {

        const query = `
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY title ASC`
        db.query(query, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
                ) VALUES ($1,$2,$3,$4,$5, $6, $7) 
                RETURNING id
                `
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso

        ]
        db.query(query, values, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id IN (${id})
            `
        db.query(query, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
        UPDATE recipes SET
            chef_id = $1,
            image= $2,
            title= $3,
            ingredients= $4,
            preparation= $5,
            information= $6

        WHERE id = $7
        `
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id

        ]
        db.query(query, values, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback()
        })
    },
    delete(id, callback) {
        const query = `DELETE FROM recipes WHERE id = ${id} `
        db.query(query, (err) => {
            if (err) throw `Database error = ${err}`

            callback()
        })
    },
    chefsSelectedOptions(callback) {
        const query = `SELECT name, id FROM chefs ORDER BY name ASC`
        db.query(query, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback(results.rows)
        })
    },
    paginate(params) {
        let { limit, offset, callback, filter } = params

        let query = ``,
            filter_query = ``,
            total_query = `(
                SELECT COUNT(*) FROM recipes
            ) AS total`

        if (filter) {
            filter_query = `
                WHERE recipes.name ILIKE '%${filter}%'
                OR recipes.email ILIKE '%${filter}%'
            `
            total_query = `(
                SELECT COUNT(*) FROM recipes
                ${filter_query}
            ) AS total
                `
        }
        query = `
            SELECT recipes.*, ${total_query}
            FROM recipes
            ${filter_query}
            ORDER BY recipes.name   DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback(results.rows)
        })
    }
}