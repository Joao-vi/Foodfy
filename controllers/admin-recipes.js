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
    return res.redirect('/admin/recipes')
}
exports.put = function(req, res) {
    return res.redirect('/admin/recipes/0')
}
exports.delete = function(req, res) {
    return res.redirect('/admin/recipes')
}