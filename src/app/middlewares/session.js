function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/users/login')

    next()
}

function isLogged(req, res, next) {
    if (req.session.userId)
        return res.redirect('/admin/users/profile')

    next()
}

module.exports = {
    onlyUsers,
    isLogged
}