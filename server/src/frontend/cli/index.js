const { encrypt, decrypt } = require('../../util/encryption')
const { toKeccak256 } = require('../../util/hash')
const { createLoggerFactory } = require('../../logger')
const { getConfig } = require('../../config')
const { encryptCli } = require('./encrypt')
const { ethereumWalletCli } = require('./ethereumWallet')
const { ethersCli } = require('./ethers')

const { Command } = require('commander')
const { ethereumWallet } = require('../../wallet/ethereum/wallet')
/*
./cli.sh crypto decrypt -h
*/
const run = async () => {
    const config = getConfig()
    const logger = createLoggerFactory(config.logger)
    const l = logger(module)

    const output = {
        writeOut: s => l.info(s),
        writeErr: s => l.error(s),
        outputError: (str, write) => write(str)
    }

    const program = new Command()
    program
        .name('CLI')
        .description('wallets, crypto and storage')
        .version('1')
        .allowExcessArguments(false)

    const ew = ethereumWallet(config.wallet, logger)

    const subCommands = [
        encryptCli(logger, encrypt, decrypt, toKeccak256),
        ethereumWalletCli(config.wallet, logger, ew),
        ethersCli(config.wallet, logger)
    ]

    subCommands.forEach(c => {
        program.addCommand(
            c.configureOutput(output)
        )
    })

    program.configureOutput(output)

    try {
        program.parse(process.argv)
    } catch (e) {
        l.error(e)
        process.exit(1)
    }
}

run()