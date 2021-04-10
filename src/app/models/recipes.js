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
            SELECT recipes.*, files.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipes.id = ${id}
            `
        try {
            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    update(data) {
        const query = `
        UPDATE recipes SET
            chef_id = $1,
            title= $2,
            ingredients= $3,
            preparation= $4,
            information= $5

        WHERE id = $6
        `
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id

        ]
        try {

            return db.query(query, values)
        } catch (err) {
            console.error(err)
        }
    },
    delete(id) {
        const query = `DELETE FROM recipes WHERE id = ${id} `
        try {

            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    chefsSelectedOptions() {
        const query = `SELECT name, id FROM chefs ORDER BY name ASC`

        try {

            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    },
    filtered(filter) {


        let query = ``,
            filter_query = ``


        if (filter) {
            filter_query = `
                WHERE recipes.title ILIKE '%${filter}%'
            `
        }
        query = `
            SELECT recipes.*, chefs.name AS chef_name, files.path
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LEFT JOIN recipe_files ON (recipe_files.recipe_id = recipes.id)
            LEFT JOIN files ON (recipe_files.file_id = files.id)
            ${filter_query}
            ORDER BY recipes.title ASC
        `
        try {

            return db.query(query)
        } catch (err) {
            console.error(err)
        }
    }
}