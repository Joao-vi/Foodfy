const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profile-controller')
const UserController = require('../app/controllers/user-controller')

routes.get('/profile', ProfileController.index)

routes.get('/create', UserController.create) // Mostrar o formulário de criação de um usuário

module.exports = routes