const Chefs = require('../models/chefs')
const Files = require('../models/file')

exports.index = function(req, res) {
    return res.render('area-adm/chefs/index')
    Chefs.all((chefs) => {
        return res.render('area-adm/chefs/index', { chefs })
    })
}
exports.create = function(req, res) {
    return res.render('area-adm/chefs/create')
}
exports.show = function(req, res) {
    const { id } = req.params
    return res.render('area-adm/chefs/chef')

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

    return res.render('area-adm/chefs/edit')
    Chefs.find(id, (chef) => {
        return res.render('area-adm/chefs/edit', { chef })
    })
}
exports.post = async function(req, res) {
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "")
            return res.send("Por favor, preencha todos os campos")
    }
    if (!req.file)
        return res.send('Please, send at least one image')

    let result = await Files.create(req.file.filename, req.file.path)
    const fileId = result.rows[0].id

    const chef = {
        ...req.body,
        file_id: fileId
    }
    result = await Chefs.create(chef)
    const chefId = result.rows[0].id
    return res.redirect(`/admin/chefs/${chefId}`)

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
    return res.redirect(`/admin/chefs`)
    Chefs.find(id, (chef) => {
        if (chef.total_recipes == 0) {
            Chefs.delete(id, () => {
                return res.redirect(`/admin/chefs`)

            })
        } else {
            return res.render('area-adm/chefs/edit', { chef })
        }
    })

}