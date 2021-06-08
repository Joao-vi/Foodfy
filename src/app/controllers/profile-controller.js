const User = require('../models/user')
module.exports = {
    async index(req, res) {
        let user = await User.find(req.session.userId)
        return res.render('area-adm/users/profile/index.njk', { user })
    },
    async put(req, res) {
        const { name, email } = req.body
        await User.update(req.session.userId, { name, email })
        return res.render('area-adm/users/profile/index.njk', { user: req.body })
    }
}