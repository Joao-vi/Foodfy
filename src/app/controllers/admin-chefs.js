const fs = require('fs')
const data = require('../../../data.json')

const Chefs = require('../models/chefs')

exports.index = function(req, res) {
    Chefs.all((chefs) => {
        return res.render('area-adm/chefs/index', { chefs })
    })
}
exports.create = function(req, res) {
    return res.render('area-adm/chefs/create')
}
exports.show = function(req, res) {
    const { id } = req.params
    Chefs.find(id, (chef) => {
        if (!chef) res.send("Chefe não encontrado!")
        Chefs.findForDetail(id, (recipes) => {
            console.log(recipes)
            return res.render('area-adm/chefs/chef', { chef, recipes })
        })
    })

}
exports.edit = function(req, res) {
    const { id } = req.params

    Chefs.find(id, (chef) => {
        return res.render('area-adm/chefs/edit', { chef })
    })
}
exports.post = function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "")
            return res.send("Por favor, preencha todos os campos")
    }
    Chefs.create(req.body, () => {
        return res.redirect("/admin/chefs")
    })
}
exports.put = function(req, res) {
    const { id } = req.body
    console.log(req.body)
    Chefs.update(req.body, () => {
        return res.redirect(`/admin/chefs/${id}`)
    })
}
exports.delete = function(req, res) {
    const { id } = req.body

    Chefs.delete(id, () => {

        return res.redirect(`/admin/chefs`)
    })
}