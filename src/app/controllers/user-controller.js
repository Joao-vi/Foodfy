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
        const { user } = req
        return res.render('user/edit.njk', { user })
    },
    async put(req, res) {
        try {
            const { id } = req.params
            let { name, email, is_admin } = req.body
            if (!is_admin)
                is_admin = 0
            await User.update(id, {
                name,
                email,
                is_admin
            })
            return res.redirect(`/admin/users/${id}/edit`)
        } catch (err) {
            console.error(err)

            return res.render('user/index.njk', {
                user: req.body,

                error: "Erro interno!"
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.params.id)
            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
            return res.redirect('/admin/users')
        }
    }
}