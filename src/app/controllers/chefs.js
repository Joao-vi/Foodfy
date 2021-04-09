const Chefs = require('../models/chefs')

exports.showAll = async function(req, res) {
    const results = await Chefs.all()
    let chefs = results.rows
    chefs = chefs.map(chef => ({
        ...chef,
        avatar_url: `${req.protocol}://${req.headers.host}${chef.avatar_url.replace('public','')}`
    }))
    return res.render('area-general/chefs/chefs', { chefs })
}