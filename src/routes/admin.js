const express = require('express')
const routes = express.Router()

const users = require('./users')

const recipesAdmin = require('../app/controllers/admin-recipes')
const chefsAdmin = require('../app/controllers/admin-chefs')

const multer = require('../app/middlewares/multer')
const { onlyUsers } = require('../app/middlewares/session')

routes.get("/", onlyUsers, (req, res) => {
    return res.redirect('/admin/recipes')
})
routes.get("/recipes", onlyUsers, recipesAdmin.index); // Mostrar a lista de receitas
routes.get("/recipes/create", onlyUsers, recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", onlyUsers, multer.array("photos", 5), recipesAdmin.post); // Cadastrar nova receita
routes.put("/recipes", onlyUsers, multer.array("photos", 5), recipesAdmin.put); // Editar uma receita
routes.delete("/recipes", onlyUsers, recipesAdmin.delete); // Deletar uma receita


routes.get("/chefs", onlyUsers, chefsAdmin.index); // Mostrar a lista de receitas
routes.get("/chefs/create", onlyUsers, chefsAdmin.create); // Mostrar formulário de nova receita
routes.get("/chefs/:id", onlyUsers, chefsAdmin.show); // Exibir detalhes de uma receita
routes.get("/chefs/:id/edit", onlyUsers, chefsAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/chefs", onlyUsers, multer.single("avatar"), chefsAdmin.post); // Cadastrar nova receita
routes.put("/chefs", onlyUsers, multer.single("avatar"), chefsAdmin.put); // Editar uma receita
routes.delete("/chefs", onlyUsers, chefsAdmin.delete); // Deletar uma receita


routes.use('/users', users)

module.exports = routes