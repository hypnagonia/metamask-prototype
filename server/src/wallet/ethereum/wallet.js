const ethers = require('ethers')

const ethereumWallet = (config, logger) => {
    const rpcClient = new ethers.JsonRpcProvider(config.rpc.url)
    const l = logger(module)

    const createWallet = () => {
        const wallet = ethers.Wallet.createRandom()
        // add privateKey to payload
        l.warn(`Sensitive data generated`)
        return { ...wallet, privateKey: wallet.privateKey }
    }

    const getBalance = async (address) => {
        if (!ethers.isAddress(address)) {
            throw new Error(`ethereum hex address expected, got ${address}`)
        }

        const balance = await rpcClient.getBalance(address)
        return balance.toString()
    }

    const sign = async (privateKey, payload) => {
        // todo hex string payload?
        const w = new ethers.Wallet(privateKey)
        const hash = ethers.hashMessage(payload)
        
        const signature = await w.signMessage(hash)
        return signature
    }

    const verifySignature = async (address, payload, signature) => {
        if (!ethers.isAddress(address)) {
            throw new Error(`Invalid ethereum hex address, got ${address}`)
        }

        const hash = ethers.hashMessage(payload)

        const recoveredAddress = ethers.verifyMessage(hash, signature)

        return address === recoveredAddress
    }

    const sendTransaction = async (privateKey, amount, recipient, payload = '0x') => {
        if (!ethers.isAddress(recipient)) {
            throw new Error(`ethereum hex address expected, got ${recipient}`)
        }

        const w = new ethers.Wallet(privateKey, rpcClient)

        // todo estimate gas price
        const transaction = {
            gasLimit: config.gasLimit,
            gasPrice: ethers.parseUnits(config.gasPrice.toString(), 'gwei'),
            to: recipient,
            value: ethers.parseEther(amount),
            data: payload
        }

        const res = await w.sendTransaction(transaction)
        return res.hash
    }

    return {
        createWallet,
        getBalance,
        sign,
        sendTransaction,
        verifySignature
    }
}

module.exports = {
    ethereumWallet
}