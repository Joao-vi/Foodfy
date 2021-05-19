const express = require('express')
const routes = express.Router()
const general = require('./general')
const admin = require('./admin')

routes.use('/', general)
routes.use('/admin', admin)


module.exports = routes