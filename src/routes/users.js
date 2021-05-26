const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profile-controller')
const UserController = require('../app/controllers/user-controller')

const UserValidator = require('../app/validators/users')

routes.get('/profile', ProfileController.index)
    //routes.put('/profile', ProfileController.put)// Editar o usuário logado


routes.get('/', UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/', UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/create', UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/:id', UserValidator.update, UserController.put) // Editar um usuário
routes.get('/:id/edit', UserValidator.profile, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/:id', UserController.delete) // Deletar um usuári

module.exports = routes