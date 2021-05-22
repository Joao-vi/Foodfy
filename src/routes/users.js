const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profile-controller')
const UserController = require('../app/controllers/user-controller')

routes.get('/profile', ProfileController.index)
    //routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado


routes.get('/', UserController.list) // Mostrar a lista de usuários cadastrados
routes.get('/create', UserController.create) // Mostrar o formulário de criação de um usuário
    //routes.post('/admin/users', UserController.post) // Cadastrar um usuário
    //routes.put('/admin/users/:id', UserController.put) // Editar um usuário
routes.get('/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
    //routes.delete('/admin/users/:id', UserController.delete) // Deletar um usuári

module.exports = routes