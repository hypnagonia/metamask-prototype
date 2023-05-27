describe('encryption', () => {
    const { encrypt, decrypt } = require('../src/util/encryption')

    const { encryptionDataMock } = require('./mock')

    encryptionDataMock.forEach(e => {
        it('able to decrypt encrypted', async () => {
            const encrypted = await encrypt(e.passphrase, e.payload)
            const decrypted = await decrypt(e.passphrase, encrypted.salt, encrypted.encryptedData)
            expect(e.payload).toEqual(decrypted)
        })

        it('should not decrypt without passphrase', async () => {
            const encrypted = await encrypt(e.passphrase, e.payload)
            let decrypted
            try {
                decrypted = await decrypt('', encrypted.salt, encrypted.encryptedData)
            } catch (err) {
                decrypted = ''
            }
            expect(e.payload).not.toEqual(decrypted)
        })
    })
})