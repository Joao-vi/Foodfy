module.exports = {
    date: function(timestamp) {
        const date = new Date(timestamp)
        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)
        const day = `0${date.getUTCDate()}`.slice(-2)
        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            bithDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    correctedSubjects_taught(teachers) {
        let Correct_teachers = new Array()
        for (row of teachers) {
            Correct_teachers.push({
                ...row,
                subjects_taught: row.subjects_taught.split(',')
            })
        }
        return Correct_teachers
    }

}