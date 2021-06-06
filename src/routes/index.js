const express = require('express')
const routes = express.Router()
const general = require('./general')
const admin = require('./admin')


routes.use('/', general)
routes.use('/admin', admin)

routes.get('/users', (req, res) => {
    return res.redirect('/admin/users/profile')
})
routes.get('/create', (req, res) => {
    return res.redirect('/admin/users/create')
})
module.exports = routes