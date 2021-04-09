const fs = require('fs')
const Recipe = require('../models/recipes')
const Recipe_files = require('../models/recipe_file')
module.exports = {
    async index(req, res) {

        let results = await Recipe.all()
        let recipes = results.rows

        let recipePromise = recipes.map(async(recipe) => ({
            ...recipe,
            files: await Recipe_files.findFeaturedPhoto(recipe.id)
        }))
        recipes = await Promise.all(recipePromise)
        recipes = recipes.map(recipe => ({
            ...recipe,
            image: `${req.protocol}://${req.headers.host}${recipe.files.rows[0].path.replace('public','')}`
        }))

        return res.render('area-general/index', { recipes })

    },
    about(req, res) {
        return res.render('area-general/about')
    },
    async showAll(req, res) {

        const { filter } = req.query


        let results = await Recipe.filtered(filter)
        let recipes = results.rows
        recipes = recipes.map(recipe => ({
            ...recipe,
            image: `${req.protocol}://${req.headers.host}${recipe.path.replace('public','')}`
        }))

        return res.render('area-general/recipes/recipes', { recipes, filter })

    },
    async show(req, res) {
        const { id } = req.params

        let results = await Recipe.find(id)
        let recipe = results.rows[0]

        recipe.image = `${req.protocol}://${req.headers.host}${recipe.path.replace('public','')}`

        return res.render('area-general/recipes/recipe', { recipe })


    }

}