const express = require('express')
const routes = express.Router()

const recipes = require('../app/controllers/recipes')

const chefs = require('../app/controllers/chefs')

routes.get('/', recipes.index)
routes.get('/about', recipes.about)


routes.get('/recipes', recipes.showAll)
routes.get('/recipes/:id', recipes.show)

routes.get('/chefs', chefs.showAll)
routes.get('/chefs/:id', chefs.show)

module.exports = routes