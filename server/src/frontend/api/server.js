const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const { auth } = require('./auth')
const { walletRouter } = require('./walletRouter')

const server = async (config, logger, wallet) => {
    const l = logger(module, 'api')
    const api = express()

    const passport = auth(api, config.auth)
    const authGuard = passport.authenticate('jwt', { session: false })

    api.use(cors())
    api.use(bodyParser.json())
    api.disable('x-powered-by')
    api.use((req, res, next) => {
        l.debug(`${req.method} ${req.path}`)
        next()
    })

    api.use('/api', authGuard, walletRouter(logger, wallet))

    const server = http.createServer(api).listen(config.port, () => {
        l.info(`API is up at http://localhost:${config.port}`)
    })

    const close = () => server.close()
    return close
}

module.exports = {
    server
}