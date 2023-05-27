const { Level } = require('level')

const levelStorage = async (config, logger) => {
    const db = new Level(config.location, { valueEncoding: 'json' })

    await new Promise((resolve, reject) => {
        db.open(resolve, { createIfMissing: config.createIfMissing })
    })

    if (!db.supports.permanence) {
        throw new Error('Persistent storage is required')
    }

    const get = async (key) => {
        return await db.get(key)
    }

    const put = async (key, value) => {
        return await db.put(key, value)
    }

    const deleteAll = async () => await db.clear()

    return {
        get,
        put,
        deleteAll
    }
}

module.exports = {
    levelStorage
}