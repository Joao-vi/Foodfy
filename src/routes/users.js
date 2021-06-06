const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/profile-controller')
const UserController = require('../app/controllers/user-controller')
const SessionController = require('../app/controllers/session-controller')

const UserValidator = require('../app/validators/users')
const SessionValidator = require('../app/validators/session')

const { isLogged, onlyUsers } = require('../app/middlewares/session')


//login/logout

routes.get('/login', isLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset pas/word

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/reset-password', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)



routes.get('/profile', onlyUsers, ProfileController.index)
    //routes.put('/profile', ProfileController.put)// Editar o usuário logado


routes.get('/', onlyUsers, UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/', onlyUsers, UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/create', onlyUsers, UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/:id', onlyUsers, UserValidator.update, UserController.put) // Editar um usuário
routes.get('/:id/edit', onlyUsers, UserValidator.profile, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/:id', onlyUsers, UserController.delete) // Deletar um usuári

module.exports = routes