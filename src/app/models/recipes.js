const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
    all() {

        let query = `
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ORDER BY title ASC`

        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
                ) VALUES ($1,$2,$3,$4,$5, $6) 
                RETURNING id
                `
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso

        ]
        try {
            return db.query(query, values)
        } catch (err) {
            console.error(err)
        }
    },
    find(id) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id IN (${id})
            `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
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
    chefsSelectedOptions() {
        const query = `SELECT name, id FROM chefs ORDER BY name ASC`

        try {

            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    filtered(params) {
        let { callback, filter } = params

        let query = ``,
            filter_query = ``


        if (filter) {
            filter_query = `
                WHERE recipes.title ILIKE '%${filter}%'
            `
        }
        query = `
            SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filter_query}
            ORDER BY recipes.title ASC
        `

        db.query(query, (err, results) => {
            if (err) throw `Database error = ${err}`

            callback(results.rows)
        })
    }
}