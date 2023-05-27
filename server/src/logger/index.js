const zerg = require('zerg').default
const { consoleTransport } = require('./consoleTransport')

const createLoggerFactory = config => {
    const loggerFactory = zerg.createLogger()

    loggerFactory.addListener(consoleTransport(config))

    const logger = (module, name) => {
        let filename
        try {
            // commonjs
            filename = module.filename.split('src/')[1].split('.')[0]

        } catch (e) {
            // for webpack build
            filename = Object.keys(module.exports)[0] || 'main'
        }

        return loggerFactory.module([filename, name].filter((a) => a).join(':'))
    }

    return logger
}

module.exports = { createLoggerFactory }
