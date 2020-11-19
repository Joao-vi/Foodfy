const express = require('express')
const routes = express.Router()
const recipes = require('./controllers/recipes')


routes.get('/', recipes.index)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.showAll)
routes.get('/recipe/:id', recipes.show)
module.exports = routes