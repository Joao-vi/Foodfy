const Recipe = require('../models/recipes')

exports.index = function(req, res) {
    return res.render('area-adm/recipes/index')
    Recipe.all((recipes) => {
        return res.render('area-adm/recipes/index', { recipes })
    })
}
exports.create = function(req, res) {
    return res.render('area-adm/recipes/create')
    Recipe.chefsSelectedOptions((options) => {
        return res.render('area-adm/recipes/create', { chefOptions: options })
    })

}
exports.show = function(req, res) {
    return res.render('area-adm/recipes/recipe')
    const { id } = req.params
    Recipe.find(id, (recipe) => {
        return res.render('area-adm/recipes/recipe', { recipe })
    })
}
exports.edit = function(req, res) {
    return res.render('area-adm/recipes/edit')
    const { id } = req.params
    Recipe.find(id, (recipe) => {
        Recipe.chefsSelectedOptions((options) => {
            return res.render('area-adm/recipes/edit', { recipe, chefOptions: options })
        })
    })

}
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "")
            return res.send("Por favor, preencha todos os campos")
    }
    return res.redirect("/admin/recipes")
    Recipe.create(req.body, (recipe) => {
        return res.redirect("/admin/recipes")
    })

}
exports.put = function(req, res) {
    return res.redirect(`/admin/recipes/${req.body.id}`)
    Recipe.update(req.body, (recipe) => {
        return res.redirect(`/admin/recipes/${req.body.id}`)
    })

}
exports.delete = function(req, res) {
    const { id } = req.body

    return res.redirect(`/admin/recipes`)
    Recipe.delete(id, () => {
        return res.redirect(`/admin/recipes`)
    })
}