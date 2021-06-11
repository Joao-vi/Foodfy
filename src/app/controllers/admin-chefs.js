const Chefs = require('../models/chefs')
const Files = require('../models/file')

module.exports = {
    async index(req, res) {
        const results = await Chefs.all()
        let chefs = results.rows
        chefs = chefs.map(chef => ({
            ...chef,
            avatar_url: `${req.protocol}://${req.headers.host}${chef.avatar_url.replace('public','')}`
        }))


        return res.render('area-adm/chefs/index', { chefs, user: req.user })

    },
    create(req, res) {
        return res.render('area-adm/chefs/create')
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


        return res.render('area-adm/chefs/chef', { chef, recipes, file, user: req.user })



    },
    async edit(req, res) {
        const { id } = req.params
        let chef = await Chefs.find(id)
        chef = chef.rows[0]
        let file = await Files.find(chef.file_id)
        file = file.rows[0]
        return res.render('area-adm/chefs/edit', { chef, file })

    },
    async post(req, res) {
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

    },
    async put(req, res) {
        const { file_id, id } = req.body
        let chef = req.body
        if (req.file) {
            result = await Files.create(req.file.filename, req.file.path)
            const fileId = result.rows[0].id
            chef = {
                ...req.body,
                file_id: fileId
            }
        }
        await Chefs.update(chef)
        if (req.file)
            await Files.delete(file_id)
        return res.redirect(`/admin/chefs/${id}`)

    },
    async delete(req, res) {
        const { id } = req.body
        let result = await Chefs.find(id)
        const chef = result.rows[0]
        if (chef.total_recipes == 0) {
            await Chefs.delete(id)
            await Files.delete(chef.file_id)
            return res.redirect(`/admin/chefs`)

        } else {
            return res.render('area-adm/chefs/edit', { chef })
        }

    }
}