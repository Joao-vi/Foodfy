const Recipe = require('../models/recipes')
const Files = require('../models/file')
const Recipe_files = require('../models/recipe_file')

module.exports = {
    async index(req, res) {

        let results = await Recipe.all()
        let recipes = results.rows

        const recipePromise = recipes.map(async(recipe) => ({
            ...recipe,
            files: await Recipe_files.find(recipe.id),
            fileId: ""
        }))
        results = await Promise.all(recipePromise)
        recipes = results.map(function(recipe) {
            if (recipe.files.rows.length > 0)
                recipe.fileId = recipe.files.rows[0].file_id

        })
        console.log(recipes)
            // return res.render('area-adm/recipes/index', { recipes })

    },
    async create(req, res) {

        const results = await Recipe.chefsSelectedOptions()
        const chefOptions = results.rows
        return res.render('area-adm/recipes/create', { chefOptions })

    },
    async show(req, res) {
        const { id } = req.params
        let results = await Recipe.find(id)
        const recipe = results.rows[0]
        return res.render('area-adm/recipes/recipe', { recipe })

    },
    async edit(req, res) {
        const { id } = req.params
        let results = await Recipe.find(id)
        const recipe = results.rows[0]

        results = await Recipe.chefsSelectedOptions()
        const chefOptions = results.rows
        return res.render('area-adm/recipes/edit', { recipe, chefOptions })

    },
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "")
                return res.send("Por favor, preencha todos os campos")
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image')

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromisse = req.files.map(file => Files.create(file.filename, file.path))
        const filesId = await Promise.all(filesPromisse)

        const receipe_filesPromisse = filesId.map(file => Recipe_files.create(recipeId, file.rows[0].id))
        await Promise.all(receipe_filesPromisse)

        return res.redirect("/admin/recipes")

    },
    async put(req, res) {
        return res.redirect(`/admin/recipes/${req.body.id}`)
        Recipe.update(req.body, (recipe) => {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })

    },
    delete(req, res) {
        const { id } = req.body

        return res.redirect(`/admin/recipes`)
        Recipe.delete(id, () => {
            return res.redirect(`/admin/recipes`)
        })
    }
}