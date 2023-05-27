const { Command } = require('commander')

const encryptCli = (logger, encrypt, decrypt, toKeccak256) => {
    const l = logger(module)
    const program = new Command('crypto').alias('c')

    program.command('encrypt')
        .alias('e')
        .description('Encrypt data')
        .argument('<password>', 'password')
        .argument('<payload>', 'payload')
        //.option('--first', 'display just the first substring')
        //.option('-s, --separator <char>', 'separator character', ',')
        .action(async (password, payload, options) => {
            const encrypted = await encrypt(password, payload)
            l.info(encrypted)
        })

    program.command('decrypt')
        .alias('d')
        .description('Decrypt data')
        .argument('<password>', 'password')
        .argument('<salt>', 'salt')
        .argument('<payload>', 'payload')
        .argument('<iv>', 'iv')
        .action(async (password, salt, payload, vector, options) => {
            try {
                const decrypted = await decrypt(password, salt, { data: payload, iv: vector })
                l.info(decrypted)
            } catch (e) {
                l.error(e.message)
            }

        })

    program.command('keccak256')
        .alias('h')
        .description('To keccak256')
        .argument('<value...>', 'values')
        .action(async (values) => {
            try {
                const v = values.reduce((a, b) => a + b, '')
                const result = toKeccak256(v)
                l.info(result)
            } catch (e) {
                l.error(e.message || e)
            }
        })

    return program
}

module.exports = {
    encryptCli
}