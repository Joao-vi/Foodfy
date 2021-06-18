const session = require('express-session')
const User = require('../models/user')
const Recipe = require('../models/recipes')
const Recipe_files = require('../models/recipe_file')

async function is_admin(id) {
    const user = await User.find({ where: { id } })

    if (user.is_admin == '1')
        return {
            user,
            is_admin: true
        }
    else
        return {
            user,
            is_admin: false

        }

}


async function onlyUsers(req, res, next) {
    const id = req.session.userId
    if (!id)
        return res.redirect('/admin/users/login')
    const user = await User.find({ where: { id } })
    if (!user)
        return res.redirect('/admin/users/login')

    req.user = user

    next()
}
async function onlyUsersAdmin(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')

    const result = await is_admin(req.session.userId)
    if (!result.is_admin) {
        return res.redirect('/admin/users')
    }
    req.user = result.user
    next()
}
async function adminOrCreatorUser(req, res, next) {
    const id = req.params.id || req.body.id

    if (!req.session.userId)
        return res.redirect('/admin/users/login')
    const result = await is_admin(req.session.userId)
    let results = await Recipe.find(id)
    let recipe = results.rows[0]
    if (!recipe || (recipe.user_id != req.session.userId && !result.is_admin)) {
        return res.redirect('/admin/recipes')
    }

    req.user = result.user

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
    isLogged,
    adminOrCreatorUser
}