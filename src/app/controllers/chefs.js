const fs = require('fs')
const data = require('../../../data.json')


exports.showAll = function(req, res) {
    return res.render('area-general/chef/chefs', { recipes: data.recipes })
}
exports.show = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find((recipe) => { return recipe.id == id })

    if (!foundRecipe)
        return res.send('Receita not Found')

    return res.render('area-general/chef/chef', { recipe: foundRecipe })
}