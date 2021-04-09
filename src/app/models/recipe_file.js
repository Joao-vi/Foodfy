const { FileSystemLoader } = require('nunjucks')
const db = require('../../config/db')
const fs = require('fs')
module.exports = {
    create(recipe_id, file_id) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
                ) VALUES ($1,$2)
                `

        const values = [
            recipe_id,
            file_id
        ]
        return db.query(query, values)
    },
    find(id) {
        const query = `
            SELECT * FROM recipe_files WHERE recipe_id=$1
        `
        try {
            return db.query(query, [id])
        } catch (err) {
            console.error(err)
        }
    },
    findFeaturedPhoto(id) {
        let query = `
        SELECT * 
        FROM recipe_files 
        LEFT JOIN files ON (recipe_files.file_id = files.id)
        WHERE recipe_files.recipe_id = $1
        LIMIT 1
        `
        try {
            return db.query(query, [id])
        } catch (err) {
            console.error(err)
        }
    },
    async delete(id) {
        try {

            return db.query(`DELETE FROM recipe_files WHERE file_id=$1`, [id])

        } catch (err) {

            console.error(err)
        }

    }
}