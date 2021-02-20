const db = require('../../config/db')
const { age, date, graduation } = require('../../lib/utils')

module.exports = {
    all(callback) {

        const query = `
            SELECT teachers.*, COUNT (students) AS total_students
            FROM teachers
            LEFT JOIN students ON (students.teacher_id = teachers.id)
            GROUP BY teachers.id ORDER BY total_students DESC
            `
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO teachers (
                avatar_url,
                name,
                birth_date,
                education_level,
                class_type,
                subjects_taught,
                created_at
                ) VALUES ($1,$2,$3,$4,$5, $6,$7) 
                RETURNING id
                `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            date(Date.now()).iso

        ]
        db.query(query, values, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        const query = `SELECT * FROM teachers WHERE id IN (${id})`
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        const query = `
            SELECT teachers.*, COUNT (students) AS total_students
            FROM teachers
            LEFT JOIN students ON (students.teacher_id = teachers.id)
            WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.subjects_taught ILIKE '%${filter}%'
            GROUP BY teachers.id 
            ORDER BY total_students DESC
            `
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
        UPDATE teachers SET
            avatar_url = $1,
            name= $2,
            birth_date= $3,
            education_level= $4,
            class_type= $5,
            subjects_taught= $6
        WHERE id = $7
        `
        const values = [
            data.avatar_url,
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            data.id

        ]
        db.query(query, values, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback()
        })
    },
    delete(id, callback) {
        const query = `DELETE FROM teachers WHERE id = ${id} `
        db.query(query, (err) => {
            if (err) throw `Database eroor = ${err}`

            callback()
        })
    },
    paginate(params) {
        let { limit, offset, callback, filter } = params

        let query = ``,
            filter_query = ``,
            total_query = `(
                SELECT COUNT(*) FROM teachers
            ) AS total`

        if (filter) {
            filter_query = `
                WHERE teachers.name ILIKE '%${filter}%'
                OR teachers.subjects_taught ILIKE '%${filter}%'
            `
            total_query = `(
                SELECT COUNT(*) FROM teachers
                ${filter_query}
            ) AS total
                `
        }
        query = `
            SELECT teachers.*, ${total_query}, COUNT (students) AS total_students
            FROM teachers
            LEFT JOIN students ON (students.teacher_id = teachers.id)
            ${filter_query}
            GROUP BY teachers.id 
            ORDER BY total_students DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    }
}