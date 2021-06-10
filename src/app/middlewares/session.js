const session = require('express-session')
const User = require('../models/user')

function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')

    next()
}
async function onlyUsersAdmin(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')
    const id = req.session.userId
    const user = await User.find({ where: { id } })

    if (!user) {
        req.session.destroy()
        return res.render('area-adm/users/login.njk', {
            error: 'Usuário não encontrado!'
        })
    }
    if (user.is_admin == '0') {
        return res.redirect('/admin/users')
    }

    next()
}

function isLogged(req, res, next) {
    if (req.session.userId)
        return res.redirect('/admin/users/profile')

    next()
}

module.exports = {
    onlyUsers,
    onlyUsersAdmin,
    isLogged
}