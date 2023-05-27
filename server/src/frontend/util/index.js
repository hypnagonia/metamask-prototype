const ethers = require('ethers')
const internalError = 'Internal Error'

const catchAsync = log => f => {
  return async (req, res, next) => {
    try {
      await f(req, res, next)
    } catch (error) {
      log.error(error)
      // todo set status codes to 400 or 500 to indicate the source of the error
      res.status(500)
      const e = error ? error.message || error : internalError
      res.json({ error: e })
      next(e)
    }
  }
}

// only ethereum chain
const isAddress = address => {
  if (!ethers.isAddress(address)) {
    throw new Error(`ethereum hex address expected, got ${address}`)
  }
}

const isAmount = amount => {
  if (isNaN(+amount)) {
    throw new Error(`amount must be a number, got ${amount}`)
  }
}

const isPayload = payload => {
}

module.exports = {
  catchAsync,
  isPayload,
  isAmount,
  isAddress,
  internalError
}
