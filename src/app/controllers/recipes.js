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
        })).reduce((reduceRecipes, recipe) => {
            if (reduceRecipes.length < 6)
                reduceRecipes.push(recipe)
            return reduceRecipes
        }, [])

        return res.render('area-general/index', { recipes })

    },
    about(req, res) {
        return res.render('area-general/about')
    },
    async showAll(req, res) {

        let { filter, limit, page } = req.query
        page = page || 1
        limit = limit || 6

        let offset = limit * (page - 1),
            pagination
        const params = {
            filter,
            page,
            limit,
            offset
        }
        let results = await Recipe.paginate(params)
        let recipes = results.rows

        const filesPromise = recipes.map(async(recipe) => ({
            ...recipe,
            files: await Recipe_files.findFeaturedPhoto(recipe.id)
        }))
        recipes = await Promise.all(filesPromise)

        if (recipes.length > 0) {
            pagination = {
                page,
                total: Math.ceil(recipes[0].total / limit)
            }
        }
        recipes = recipes.map(recipe => ({
            ...recipe,
            image: `${req.protocol}://${req.headers.host}${recipe.files.rows[0].path.replace('public','')}`
        }))

        return res.render('area-general/recipes/recipes', { recipes, filter, pagination })

    },
    async show(req, res) {
        const { id } = req.params

        let results = await Recipe.find(id)
        let recipe = results.rows[0]
        let files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))


        return res.render('area-general/recipes/recipe', { recipe, files })


    }

}