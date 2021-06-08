const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const User = require('../models/user')


module.exports = {
    loginForm(req, res) {
        return res.render('area-adm/session/login.njk')
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect('/admin/users/profile')
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/admin')
    },
    forgotForm(req, res) {
        return res.render('area-adm/session/forgot-password.njk')
    },
    async forgot(req, res) {

        const user = req.user
        try {
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()

            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })


            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha de acesso',
                html: `
                    <h2>Recuperação de senha</h2>
                    <h3>${user.name},</h3>
    
                    <p>Clique no link abaixo para iniciar o processo de recuperação de senha:</p>
                    <p>
                        <a href="http://localhost:3000/users/reset-password?token=${token}" target="_blank">Recuperar Senha</a>
                    </p>
                `
            })
            return res.render('area-adm/session/forgot-password', {
                user: req.body,
                success: "Email de recuperação enviado com sucesso!"
            })

        } catch (error) {
            console.error(error)
            return res.render('session/forgot-password', {
                user: user,
                error: "Erro inesperado, tente novamente"
            })
        }


    },
    resetForm(req, res) {
        return res.render('area-adm/session/reset-password.njk', { token: req.query.token })
    },
    async reset(req, res) {
        const user = req.user
        const { token, password } = req.body

        try {
            const newPassword = await hash(password, 8)
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })
            return res.render('area-adm/session/login', {
                user: req.body,
                success: "Senha atualizada com sucesso!"
            })
        } catch (error) {
            console.error(error)
            return res.render('area-adm/session/reset-password', {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente"
            })
        }
    }

}