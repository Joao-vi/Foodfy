const express = require('express')
const routes = express.Router()

const recipesAdmin = require('../app/controllers/admin-recipes')
const chefsAdmin = require('../app/controllers/admin-chefs')

const multer = require('../app/middlewares/multer')


routes.get("/", (req, res) => {
    return res.redirect('/admin/recipes')
})
routes.get("/recipes", recipesAdmin.index); // Mostrar a lista de receitas
routes.get("/recipes/create", recipesAdmin.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", recipesAdmin.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", recipesAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", multer.array("photos", 5), recipesAdmin.post); // Cadastrar nova receita
routes.put("/recipes", multer.array("photos", 5), recipesAdmin.put); // Editar uma receita
routes.delete("/recipes", recipesAdmin.delete); // Deletar uma receita


routes.get("/chefs", chefsAdmin.index); // Mostrar a lista de receitas
routes.get("/chefs/create", chefsAdmin.create); // Mostrar formulário de nova receita
routes.get("/chefs/:id", chefsAdmin.show); // Exibir detalhes de uma receita
routes.get("/chefs/:id/edit", chefsAdmin.edit); // Mostrar formulário de edição de receita

routes.post("/chefs", multer.single("avatar"), chefsAdmin.post); // Cadastrar nova receita
routes.put("/chefs", multer.single("avatar"), chefsAdmin.put); // Editar uma receita
routes.delete("/chefs", chefsAdmin.delete); // Deletar uma receita


module.exports = routes