const User = require('../models/user')

module.exports = {
    async list(req, res) {
        const results = await User.all()
        let users = results.rows

        return res.render('user/index.njk', { users })
    },
    create(req, res) {
        return res.render('user/register.njk')
    },
    async post(req, res) {
        req.body.password = "teste"

        await User.create(req.body)
            //mandar email com senha criada 
        return res.redirect('/admin/users/')
    },
    async edit(req, res) {
        return res.render('user/edit.njk')
    }
}