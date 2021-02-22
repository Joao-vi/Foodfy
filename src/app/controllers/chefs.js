const Chefs = require('../models/chefs')

exports.showAll = function(req, res) {
    Chefs.all((chefs) => {
        return res.render('area-general/chefs/chefs', { chefs })

    })
}
exports.show = function(req, res) {
    const { id } = req.params
    Chefs.find(id, (chef) => {

        return res.render('area-general/chefs/chef', { chef })
    })
}