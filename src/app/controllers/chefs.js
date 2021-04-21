const Chefs = require('../models/chefs')
const Files = require('../models/file')
const { show } = require('./recipes')
module.exports = {

    async showAll(req, res) {
        const results = await Chefs.all()
        let chefs = results.rows
        chefs = chefs.map(chef => ({
            ...chef,
            avatar_url: `${req.protocol}://${req.headers.host}${chef.avatar_url.replace('public','')}`
        }))
        return res.render('area-general/chefs/chefs', { chefs })
    },
    async show(req, res) {
        const { id } = req.params
        let chef = await Chefs.find(id)
        chef = chef.rows[0]
        if (!chef)
            return res.send("Chefe não encontrado!")
        let file = await Files.find(chef.file_id)
        file = file.rows[0]
        if (file)
            file.path = `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        let recipes = await Chefs.findForDetail(id)
        recipes = recipes.rows
        recipes = recipes.map(recipe => ({
            ...recipe,
            image: `${req.protocol}://${req.headers.host}${recipe.path.replace('public','')}`
        }))


        return res.render('area-general/chefs/chef', { chef, recipes, file })
    }
}