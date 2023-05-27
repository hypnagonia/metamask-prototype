const { Command } = require('commander')
const ethers = require('ethers')

// ./cli.sh e e "isAddress(\"0xcB623A292147BE825426b26dfB659493c1997d78\")"
const ethersCli = (config, logger) => {
    const l = logger(module)
    const program = new Command('ethers').alias('e')

    program.command('eval')
        .alias('e')
        .description('Eval function of ethers library')
        .argument('<evalcode>', 'function')
        //.option('--first', 'display just the first substring')
        //.option('-s, --separator <char>', 'separator character', ',')
        .action(async (evalcode) => {
            const rpcClient = new ethers.JsonRpcProvider(config.rpc.url)
            l.info(`RPC: ${config.rpc.url}`)
            l.info(`ethers.${evalcode}`)
            const response = eval(`ethers.${evalcode}`)

            if (response instanceof Promise) {
                const r = await response
                l.info(r)
                return
            } 

            l.info(response)
        })

    return program
}

module.exports = {
    ethersCli
}