describe('wallet manager', () => {
    const ethers = require('ethers')
    const { createLoggerFactory } = require('../src/logger')
    const { storageFactory } = require('../src/storage')
    const { getConfig } = require('../src/config')
    const { walletManager } = require('../src/wallet/walletManager')

    const config = getConfig()
    config.storage.location = './testdb'

    // would be nice to have a mock logger
    const logger = createLoggerFactory(config.logger)
    const l = logger(module)

    let storage 
    let wm

    beforeAll(async () => {
        // set up a database connection before running the tests
        storage = await storageFactory(config.storage, logger)
        wm = walletManager(config.wallet, logger, storage)
    })

    afterAll(async () => {
        await storage.deleteAll()
    })

    describe('create wallet', () => {
        const userId = 'abc'
        it('should be a valid address', async () => {
            const address = await wm.createWallet(userId)
            expect(ethers.isAddress(address)).toEqual(true)
        })

        it('should store persistant and able to get', async () => {
            const address = await wm.createWallet(userId)
            const storedAddress = await wm.getWallet(userId)
            expect(address).toEqual(storedAddress)
        })
    })
})