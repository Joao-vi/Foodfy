const fs = require('fs')
const Recipe = require('../models/recipes')

exports.index = function(req, res) {
    //Recipe.all((recipes) => {
    //return res.render('area-general/index', { recipes })
    return res.render('area-general/index')
        //  })
}
exports.about = function(req, res) {
    return res.render('area-general/about')
}


exports.showAll = function(req, res) {
    return res.render('area-general/recipes/recipes')
    const { filter } = req.query

    const params = {
        filter,
        callback(recipes) {
            return res.render('area-general/recipes/recipes', { recipes, filter })
        }
    }
    Recipe.filtered(params)

}
exports.show = function(req, res) {
    const { id } = req.params

    return res.render('area-general/recipes/recipe')
    Recipe.find(id, (recipe) => {
        return res.render('area-general/recipes/recipe', { recipe })
    })

}