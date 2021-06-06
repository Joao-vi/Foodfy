const express = require('express')
const nunjucks = require('nunjucks')
const server = express()

const session = require('./config/session')
const route = require('./routes')
const port = portNormalize(process.env.PORT || "5000")

const methodOverride = require('method-override')
server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session

    next()
})
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride("_method"))
server.use(route)
server.set('view engine', 'njk')

nunjucks.configure('./src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})
server.listen(port, () => {
    console.log('server is running in port ' + port)
})

function portNormalize(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}