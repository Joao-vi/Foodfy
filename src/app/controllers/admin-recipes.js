const Recipe = require('../models/recipes')
const Files = require('../models/file')
const Recipe_files = require('../models/recipe_file')

module.exports = {
    async index(req, res) {

        let results = await Recipe.all()
        let recipes = results.rows

        let recipePromise = recipes.map(async(recipe) => ({
            ...recipe,
            files: await Recipe_files.find(recipe.id)
        }))
        recipes = await Promise.all(recipePromise)
        for (let recipe of recipes) {
            if (recipe.files.rows.length > 0)
                recipe.fileId = recipe.files.rows[0].file_id
        }
        recipePromise = recipes.map(async(recipe) => ({
            ...recipe,
            file: await Files.find(recipe.fileId)
        }))
        recipes = await Promise.all(recipePromise)
        for (let recipe of recipes) {
            if (recipe.files.rows.length > 0)
                recipe.image = `${req.protocol}://${req.headers.host}${recipe.file.rows[0].path.replace('public','')}`
        }
        //console.log(recipes)
        return res.render('area-adm/recipes/index', { recipes })

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

        results = await Recipe_files.find(id)
        let recipeFiles = results.rows
        recipeFiles = recipeFiles.map(file => file.file_id)
        recipeFiles = Object.values(recipeFiles)
        results = await Files.findPhotos(recipeFiles)

        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))

        return res.render('area-adm/recipes/edit', { recipe, chefOptions, files })

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

        const filesPromise = req.files.map(file => Files.create(file.filename, file.path))
        const filesId = await Promise.all(filesPromise)

        const receipe_filesPromise = filesId.map(file => Recipe_files.create(recipeId, file.rows[0].id))
        await Promise.all(receipe_filesPromise)

        return res.redirect("/admin/recipes")

    },
    async put(req, res) {

        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == '' && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => Files.create(file.filename, file.path, req.body.id))
            const filesId = await Promise.all(newFilesPromise)

            const receipe_filesPromise = filesId.map(file => Recipe_files.create(req.body.id, file.rows[0].id))
            await Promise.all(receipe_filesPromise)
        }
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedRecipeFilePromise = removedFiles.map(id => Recipe_files.delete(id))
            await Promise.all(removedRecipeFilePromise)

            const removedFilesPromise = removedFiles.map(id => Files.delete(id))
            await Promise.all(removedFilesPromise)


        }

        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)

    },
    delete(req, res) {
        const { id } = req.body

        return res.redirect(`/admin/recipes`)
        Recipe.delete(id, () => {
            return res.redirect(`/admin/recipes`)
        })
    }
}