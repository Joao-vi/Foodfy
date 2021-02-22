const fs = require('fs')
const Recipe = require('../models/recipes')

exports.index = function(req, res) {
    Recipe.all((recipes) => {
        return res.render('area-general/index', { recipes })
    })
}
exports.about = function(req, res) {
    return res.render('area-general/about')
}


exports.showAll = function(req, res) {
    Recipe.all((recipes) => {
        return res.render('area-general/recipes/recipes', { recipes })
    })
}
exports.show = function(req, res) {
    const { id } = req.params

    Recipe.find(id, (recipe) => {
        return res.render('area-general/recipes/recipe', { recipe })
    })

}