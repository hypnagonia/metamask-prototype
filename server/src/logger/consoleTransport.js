const zerg = require('zerg').default
const { consoleNodeColorful } = require('zerg/dist/transports')
const colorize = require('json-colorizer')

const handler = config => logMessage => {
    if (typeof logMessage.message === 'object') {
        logMessage.message = colorize(JSON.stringify(logMessage.message, null, 2))
    } 

    const date = new Date().toISOString()

    if (config.showTimestamp) {
        logMessage.message = `[${date}] ${logMessage.message}`
    }

    return logMessage
}

const consoleTransport = config => zerg.createListener({
    handler: (...args) => consoleNodeColorful(handler(config)(...args)),
    levels: config.levels,
})

module.exports = { consoleTransport }
