const { levelStorage } = require('./level/level')
const { toKeccak256 } = require('../util/hash')

const generateKey = key => toKeccak256(key)

const storageFactory = async (config, logger) => {
    const s = await levelStorage(config, logger)

    const getWallet = async (walletId) => {
        const key = generateKey(walletId)
        return s.get(key)
    }

    const saveWallet = async (walletId, payload) => {
        const key = generateKey(walletId)
        await s.put(key, payload)
    }

    const deleteAll = s.deleteAll

    return {
        getWallet,
        saveWallet,
        deleteAll
    }
}

module.exports = { storageFactory }