module.exports = {
    list(req, res) {
        return res.render('user/index.njk')
    },
    create(req, res) {
        return res.render('user/create.njk')
    },
    async edit(req, res) {
        return res.render('user/edit.njk')
    }
}