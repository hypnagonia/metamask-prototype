const { getConfig } = require('./config')
const { createLoggerFactory } = require('./logger')
const { server: apiServer } = require('./frontend/api/server')
const { walletManager } = require('./wallet/walletManager')
const { storageFactory } = require('./storage')

const run = async () => {
    global.fetch = (await import('node-fetch')).default // ugly stuff already regretting not using ts

    const config = getConfig()
    const logger = createLoggerFactory(config.logger)
    const l = logger(module)

    l.info('starting storage')
    const storage = await storageFactory(config.storage, logger)

    l.info('starting app')
    const wallet = walletManager(config.wallet, logger, storage)
    
    l.info('starting api server')
    const api = await apiServer(config.api, logger, wallet)
}

run()