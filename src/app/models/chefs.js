const db = require('../../config/db')
const { age, date, graduation } = require('../../lib/utils')

module.exports = {
    all() {

        const query = `
            SELECT chefs.*, 
            COUNT (recipes) AS total_recipes, 
            (SELECT files.path FROM files WHERE files.id=chefs.file_id) AS avatar_url
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id 
            ORDER BY total_recipes DESC
            `

        //const query = `
        //    SELECT chefs.*
        //    FROM chefs
        //    ORDER BY name ASC
        //    `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    create(data) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id,
                created_at
                ) VALUES ($1,$2,$3) 
                RETURNING id
                `
        const values = [
            data.name,
            data.file_id,
            date(Date.now()).iso
        ]
        return db.query(query, values)


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
    findBy(filter, callback) {
        const query = `
            SELECT chefs.*, COUNT (recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.name ILIKE '%${filter}%'
            OR chefs.subjects_taught ILIKE '%${filter}%'
            GROUP BY chefs.id 
            ORDER BY total_recipes DESC
            `
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    },
    update(data) {
        const query = `
        UPDATE chefs SET
            name= $1,
            file_id = $2

            WHERE id = $3
        `
        const values = [
            data.name,
            data.file_id,
            data.id
        ]
        try {

            return db.query(query, values)
        } catch (err) {
            console.error(err)
        }
    },
    delete(id) {
        const query = `DELETE FROM chefs WHERE id = ${id} `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    paginate(params) {
        let { limit, offset, callback, filter } = params

        let query = ``,
            filter_query = ``,
            total_query = `(
                SELECT COUNT(*) FROM chefs
            ) AS total`

        if (filter) {
            filter_query = `
                WHERE chefs.name ILIKE '%${filter}%'
                OR chefs.subjects_taught ILIKE '%${filter}%'
            `
            total_query = `(
                SELECT COUNT(*) FROM chefs
                ${filter_query}
            ) AS total
                `
        }
        query = `
            SELECT chefs.*, ${total_query}, COUNT (recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            ${filter_query}
            GROUP BY chefs.id 
            ORDER BY total_recipes DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    },
    findForDetail(id) {
        const query = `
            SELECT  recipes.id, recipes.chef_id,  recipes.title, chefs.name AS chef_name,files.path
            FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id  = chefs.id)
            LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipes.chef_id=${id}
            ORDER BY recipes.created_at DESC
            `
        try {

            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    }
}