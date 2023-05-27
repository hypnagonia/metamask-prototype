const { Command } = require('commander')

const ethereumWalletCli = (config, logger, ethereumWallet) => {
    const l = logger(module)
    const program = new Command('eth-wallet').alias('w')

    program.command('new')
        .alias('n')
        .description('Generate new ethereum wallet')
        .action(async () => {
            const wallet = ethereumWallet.createWallet()
            l.info(wallet)

        })

    program.command('sign')
        .alias('s')
        .description('Sign payload with ethereum wallet')
        .argument('<Private Key>', 'Private Key')
        .argument('<Payload>', 'Payload')
        .action(async (privateKey, payload) => {
            const signature = await ethereumWallet.sign(privateKey, payload)
            l.info({ signature })

        })

    // todo network    
    program.command('balance')
        .alias('b')
        .description('Get balance')
        .argument('<Address>', 'Address')
        .action(async (address) => {
            l.info(`RPC: ${config.rpc.url}`)
            const balance = await ethereumWallet.getBalance(address)
            l.info({ balance })

        })

    program.command('verify-signature')
        .alias('v')
        .description('Verify if payload was signed by the given address')
        .argument('<Address>', 'Address')
        .argument('<Payload>', 'Payload')
        .argument('<Signature>', 'Signature')
        .action(async (address, payload, signature) => {
            try {
                const isVerified = await ethereumWallet.verifySignature(address, payload, signature)
                if (isVerified) {
                    l.info('Valid')
                } else {
                    l.error('Invalid')
                }
            } catch (e) {
                l.error(e.message || e)
            }
        })

    return program
}

module.exports = {
    ethereumWalletCli
}