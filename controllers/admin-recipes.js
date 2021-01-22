const fs = require('fs')
const data = require('../data.json')

exports.index = function(req, res) {

    return res.render('area-adm/index', { recipes: data.recipes })
}
exports.create = function(req, res) {
    return res.render('area-adm/create')
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => { return recipe.id == id })

    if (!foundRecipe)
        return res.send('Receita not Found')

    return res.render('area-adm/recipe', { recipe: foundRecipe })
}
exports.edit = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => { return recipe.id == id })

    if (!foundRecipe)
        return res.send('Receita not Found')
    return res.render('area-adm/edit', { recipe: foundRecipe })
}
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "")
            return res.send("Por favor, preencha todos os campos")
    }

    let { image, title, author, ingredients, preparation, information } = req.body

    let id = 1
    const lastRecipes = data.recipes[data.recipes.length - 1]

    if (lastRecipes) {
        id = lastRecipes.id + 1
    }

    data.recipes.push({
        id,
        image,
        title,
        author: `por ${author}`,
        ingredients,
        preparation,
        information

    })
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {

            if (err)
                return res.send("Erro ao escrever arquivo")

            return res.redirect("/admin/recipes")

        })
        // return res.send(req.body)
}
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0;
    const foundRecipes = data.recipes.find((recipe, foundindex) => {
        if (recipe.id == id) {
            index = foundindex
            return true
        }
    })

    if (!foundRecipes)
        return res.send('Receita não encontrada!')

    const recipe = {
        ...foundRecipes,
        ...req.body,
        id: Number(req.body.id)
    }
    data.recipes[index] = recipe
    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err)
            return res.send("Write error!")

        return res.redirect(`/admin/recipes/${id}`)
    })
}
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredRecipes = data.recipes.filter((recipe) => {
        return recipe.id != id
    })

    data.recipes = filteredRecipes

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err)
            return res.send("Write error!")

        return res.redirect(`/admin/recipes`)
    })
}