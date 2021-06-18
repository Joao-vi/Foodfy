const { Console } = require('console')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const User = require('../models/user')

module.exports = {
    async list(req, res) {
        const id = req.session.userId
        const results = await User.all()
        let users = results.rows

        let loggedUser = users.filter(user => user.id == id ? user : null)


        //await User.find({ where: { id } })
        return res.render('area-adm/users/index.njk', { users, loggedUser: loggedUser[0] })
    },
    async create(req, res) {
        const id = req.session.userId
        const loggedUser = await User.find({ where: { id } })
        return res.render('area-adm/users/register.njk', { loggedUser })
    },
    async post(req, res) {
        try {
            req.body.password = crypto.randomBytes(4).toString('hex')

            const result = await User.create(req.body)
            const user = result.rows[0]
            if (!user)
                return res.render('area-adm/users/register.njk', {
                    user: req.body,
                    error: "Erro ao registrar usuário!"
                })

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Senha de acesso ao Foodfy',
                html: `
                <h2>Senha de acesso</h2>
                <h3>${req.body.name},</h3>
                <p>Sua senha: ${req.body.password}</p>
                <p>Clique no link abaixo para realizar seu login no Foodfy:</p>
                <p>
                    <a href="http://localhost:3000/admin/users/login" target="_blank">Login</a>
                </p>
            `
            })
            return res.redirect('/admin/users/')
        } catch (error) {
            console.error(error)
            return res.render('area-adm/users/register.njk', {
                user: req.body,
                error: "Erro inesperado!"
            })
        }
    },
    async edit(req, res) {
        const id = req.params.id
        const user = await User.find({ where: { id } })
        return res.render('area-adm/users/edit.njk', { user, loggedUser: req.user })
    },
    async put(req, res) {
        const { id } = req.params
        req.body.id = id
        try {
            let { name, email, is_admin } = req.body
            if (!is_admin)
                is_admin = 0
            await User.update(id, {
                name,
                email,
                is_admin
            })

            return res.render(`area-adm/users/edit.njk`, { user: req.body, loggedUser: req.user, success: "Usuário atualizado!" })
        } catch (err) {
            console.error(err)

            return res.redirect(`/admin/users/${id}/edit`)
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