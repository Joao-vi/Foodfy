const User = require('../models/user')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)
    for (let key of keys) {
        if (body[key] == '' && key == 'is_admin') {
            return {
                user: body,
                error: 'Preencha todos os campos'
            }
        }
    }
}

async function post(req, res, next) {

    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('area-adm/users/register.njk', fillAllFields)
    }

    const { email } = req.body

    const user = await User.find({
        where: { email }
    })

    if (user)
        return res.render("area-adm/users/register.njk", {
            user: req.body,
            error: 'Usuário já cadastrado.'
        })



    next()
}
async function profile(req, res, next) {
    const { id } = req.params
    const user = await User.find({ where: { id } })

    if (!user) {
        return res.render('area-adm/users/index.njk', {
            error: "Usuário não encontrado"
        })
    }

    req.user = user
    next()
}
async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('area-adm/users/edit.njk', fillAllFields)
    }

    const { id } = req.params


    const user = await User.find({ where: { id } })

    if (!user) {
        return res.render('area-adm/users/edit.njk', {
            error: "Usuário não encontrado"
        })
    }



    req.user = user
    next()
}

async function updateProfile(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('area-adm/users/profile/index.njk', fillAllFields)
    }

    const id = req.session.userId


    const user = await User.find({ where: { id } })

    if (!user) {
        return res.render('area-adm/users/profile/index.njk', {
            error: "Usuário não encontrado"
        })
    }
    const passed = await compare(req.body.password, user.password)
    if (!passed) {
        return res.render('area-adm/users/profile/index.njk', {
            user: user,
            error: "Senha inválida"
        })
    }


    req.user = user
    next()
}

module.exports = {
    post,
    profile,
    update,
    updateProfile
}