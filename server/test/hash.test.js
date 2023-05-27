describe('hash', () => {
    const { toKeccak256 } = require('../src/util/hash')

    const { hashDataMock } = require('./mock')

    hashDataMock.forEach(e => {
        it('able to decrypt encrypted', async () => {
            const result = toKeccak256(e.value)
            expect(e.result).toEqual(result)
        })
    })
})