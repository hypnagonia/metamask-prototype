const { encrypt, decrypt } = require('../../util/encryption')
const { toKeccak256 } = require('../../util/hash')
const { createLoggerFactory } = require('../../logger')
const { getConfig } = require('../../config')
const { ethereumWallet } = require('../../wallet/ethereum/wallet')
const Vorpal = require('vorpal')();

const run = async () => {
    global.inquirer = (await import('inquirer')).default
    const i = global.inquirer

    const config = getConfig()
    const logger = createLoggerFactory(config.logger)
    const l = logger(module)

    const menu = [
        {
            name: 'Crypto',
            value: 'crypto',
        },
        {
            name: 'Ethereum Wallet',
            value: 'etheremWallet',
        },
        {
            name: 'Storage',
            value: 'storage',
        },
        {
            name: 'Exit',
            value: 'exit',
        },
    ];

    Vorpal
        .command('subcommand1', 'Description of subcommand1')
        .action(function (args, callback) {
            this.log('Executing subcommand1');
            callback();
        });

    Vorpal
        .command('subcommand2', 'Description of subcommand2')
        .action(function (args, callback) {
            this.log('Executing subcommand2');
            callback();
        });

    Vorpal
        .mode('menu')
        .delimiter('myapp$')
        .init(function (args, callback) {
            this.log('Welcome to the menu!');
            this.log('Type "help" for a list of available commands.');
            callback();
        })
        .command('main', 'Return to the main menu')
        .action(function (args, callback) {
            this.log('Returning to the main menu');
            callback();
        });

    Vorpal
        .delimiter('myapp$')
        .show();




}

run()