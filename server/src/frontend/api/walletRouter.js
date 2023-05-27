const { Router } = require('express')
const { catchAsync, isAddress, isAmount, isPayload, internalError } = require('../util')

// todo better error handling
const walletRouter = (logger, wallet) => {
    const l = logger(module, 'walletRouter')
    const walletRouter = Router({ mergeParams: true })

    const getBalance = async (req, res, next) => {
        const userId = req.user

        // todo it is go-through query, nice to cache for a short time
        const balance = await wallet.getBalance(userId)

        res.json({ balance })
    }

    const createWallet = async (req, res, next) => {
        const userId = req.user
        const w = await wallet.createWallet(userId)
        res.json({ wallet: w })
    }

    const signPayload = async (req, res, next) => {
        const userId = req.user
        const { payload } = req.body
        isPayload(payload)

        try {
            const signature = await wallet.signPayload(userId, payload)
            res.json({ signature })
        } catch (e) {
            throw new Error(internalError)
        }
    }

    const getWallet = async (req, res, next) => {
        const userId = req.user
        const w = await wallet.getWallet(userId)

        res.json({ wallet: w })
    }

    const sendTransaction = async (req, res, next) => {
        const userId = req.user
        const { recipient, amount, payload } = req.body
        isAmount(amount)
        isAddress(recipient)
        isPayload(payload)

        try {
            const transactionHash = await wallet.sendTransaction(userId, amount, recipient, payload)
            res.json({ transactionHash })
        } catch (e) {
            throw new Error(internalError)
        }
    }

    const c = catchAsync(l)
    walletRouter.post('/balance', c(getBalance))
    walletRouter.post('/create', c(createWallet))
    walletRouter.post('/sign', c(signPayload))
    walletRouter.post('/send', c(sendTransaction))
    walletRouter.post('/', c(getWallet))

    return walletRouter
}

module.exports = {
    walletRouter
}

