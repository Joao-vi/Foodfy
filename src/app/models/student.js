const db = require('../../config/db')
const { age, date, graduation } = require('../../lib/utils')

module.exports = {
    all(callback) {

        const query = `SELECT * FROM students ORDER BY name ASC`
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO students (
                avatar_url,
                name,
                email,
                birth_date,
                school_year,
                workload,
                teacher_id
                ) VALUES ($1,$2,$3,$4,$5, $6, $7) 
                RETURNING id
                `
        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth_date).iso,
            data.school_year,
            data.workload,
            data.teacher

        ]
        db.query(query, values, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        const query = `
            SELECT students.*, teachers.name AS teacher_name 
            FROM students 
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id IN (${id})
            `
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
        UPDATE students SET
            avatar_url = $1,
            name= $2,
            email= $3,
            birth_date= $4,
            school_year= $5,
            workload= $6,
            teacher_id=$7

        WHERE id = $8
        `
        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth_date).iso,
            data.school_year,
            data.workload,
            data.teacher,
            data.id

        ]
        db.query(query, values, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback()
        })
    },
    delete(id, callback) {
        const query = `DELETE FROM students WHERE id = ${id} `
        db.query(query, (err) => {
            if (err) throw `Database eroor = ${err}`

            callback()
        })
    },
    teachersSelectedOptions(callback) {
        const query = `SELECT name, id FROM teachers ORDER BY name ASC`
        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    },
    paginate(params) {
        let { limit, offset, callback, filter } = params

        let query = ``,
            filter_query = ``,
            total_query = `(
                SELECT COUNT(*) FROM students
            ) AS total`

        if (filter) {
            filter_query = `
                WHERE students.name ILIKE '%${filter}%'
                OR students.email ILIKE '%${filter}%'
            `
            total_query = `(
                SELECT COUNT(*) FROM students
                ${filter_query}
            ) AS total
                `
        }
        query = `
            SELECT students.*, ${total_query}
            FROM students
            ${filter_query}
            ORDER BY students.name   DESC
            LIMIT ${limit} OFFSET ${offset}
        `

        db.query(query, (err, results) => {
            if (err) throw `Database eroor = ${err}`

            callback(results.rows)
        })
    }
}