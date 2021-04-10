const express = require('express')
const routes = express.Router()
const multer = require('../src/app/middlewares/multer')
const recipes = require('./app/controllers/recipes')
const recipesAdmin = require('./app/controllers/admin-recipes')

const chefsAdmin = require('./app/controllers/admin-chefs')
const chefs = require('./app/controllers/chefs')


routes.get('/', recipes.index)
routes.get('/about', recipes.about)


routes.get('/recipes', recipes.showAll)
routes.get('/recipe/:id', recipes.show)

routes.get('/chefs', chefs.showAll)


routes.get('/admin', (req, res) => {
    return res.redirect('/admin/recipes')
})
routes.get("/admin/recipes", recipesAdmin.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", multer.array("photos", 5), recipesAdmin.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), recipesAdmin.put); // Editar uma receita
routes.delete("/admin/recipes", recipesAdmin.delete); // Deletar uma receita


routes.get("/admin/chefs", chefsAdmin.index); // Mostrar a lista de receitas
routes.get("/admin/chefs/create", chefsAdmin.create); // Mostrar formulário de nova receita
routes.get("/admin/chefs/:id", chefsAdmin.show); // Exibir detalhes de uma receita
routes.get("/admin/chefs/:id/edit", chefsAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/admin/chefs", multer.single("avatar"), chefsAdmin.post); // Cadastrar nova receita
routes.put("/admin/chefs", multer.single("avatar"), chefsAdmin.put); // Editar uma receita
routes.delete("/admin/chefs", chefsAdmin.delete); // Deletar uma receita


module.exports = routes