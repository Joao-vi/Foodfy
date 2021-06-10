const express = require('express')
const routes = express.Router()

const users = require('./users')

const recipesAdmin = require('../app/controllers/admin-recipes')
const chefsAdmin = require('../app/controllers/admin-chefs')

const multer = require('../app/middlewares/multer')
const { onlyUsers, onlyUsersAdmin } = require('../app/middlewares/session')

routes.get("/", (req, res) => {
    return res.redirect('/admin/recipes')
})
routes.get("/recipes", onlyUsers, recipesAdmin.index); // Mostrar a lista de receitas
routes.get("/recipes/create", onlyUsersAdmin, recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsersAdmin, recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", onlyUsersAdmin, multer.array("photos", 5), recipesAdmin.post); // Cadastrar nova receita
routes.put("/recipes", onlyUsersAdmin, multer.array("photos", 5), recipesAdmin.put); // Editar uma receita
routes.delete("/recipes", onlyUsersAdmin, recipesAdmin.delete); // Deletar uma receita


routes.get("/chefs", onlyUsers, chefsAdmin.index); // Mostrar a lista de receitas
routes.get("/chefs/create", onlyUsersAdmin, chefsAdmin.create); // Mostrar formulário de nova receita
routes.get("/chefs/:id", onlyUsersAdmin, chefsAdmin.show); // Exibir detalhes de uma receita
routes.get("/chefs/:id/edit", onlyUsersAdmin, chefsAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/chefs", onlyUsersAdmin, multer.single("avatar"), chefsAdmin.post); // Cadastrar nova receita
routes.put("/chefs", onlyUsersAdmin, multer.single("avatar"), chefsAdmin.put); // Editar uma receita
routes.delete("/chefs", onlyUsersAdmin, chefsAdmin.delete); // Deletar uma receita


routes.use('/users', users)

module.exports = routes