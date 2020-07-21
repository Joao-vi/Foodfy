const express = require('express')
const nunjucks = require('nunjucks')

const server = express()

const receitas = require('./data')

const port = process.env.PORT || 3000

server.use(express.static('./front-end/public'))

server.set('view engine', 'njk')

nunjucks.configure('./front-end/views', {
    express: server,
    autoescape: false,
    noCache: true
})
server.get('/', (req, res) => {
    return res.render('index', { receitas })

})
server.get('/sobre', (req, res) => {
    return res.render('sobre')

})
server.get('/receitas', (req, res) => {
    return res.render('receitas', { receitas })
})

server.get('/receita/:id', (req, res) => {
    const id = req.params.id


    if (id >= receitas.length)
        return res.send('Receita not Found')
    return res.render('receita', { receita: receitas[id] })


})

server.listen(port, () => {
    console.log('server is running in port ' + port)
})