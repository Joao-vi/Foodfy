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

    const user = await User.findOne({
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
    const user = await User.findOne({ where: { id } })

    if (!user) {
        return res.render('user/index.njk', {
            error: "Usuário não encontrado"
        })
    }

    req.user = user
    next()
}
async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields) {
        return res.render('user/edit.njk', fillAllFields)
    }

    const { id } = req.params


    const user = await User.findOne({ where: { id } })

    if (!user) {
        return res.render('user/edit.njk', {
            error: "Usuário não encontrado"
        })
    }



    req.user = user
    next()
}

module.exports = {
    post,
    profile,
    update
}