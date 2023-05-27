describe('ethereum wallet', () => {
  const ethers = require('ethers')

  const { ethereumWallet } = require('../src/wallet/ethereum/wallet')
  const { createLoggerFactory } = require('../src/logger')
  const { getConfig } = require('../src/config')

  const config = getConfig()

  // would be nice to have a mock logger
  const logger = createLoggerFactory(config.logger)
  const l = logger(module)

  const wallet = ethereumWallet(config.wallet, logger)

  describe('create new wallet', () => {
    const res = wallet.createWallet()

    it('should be a valid address', () => {
      expect(ethers.isAddress(res.address)).toEqual(true)
    })

    it('address should belong to private key', () => {
      const wallet = new ethers.Wallet(res.privateKey);
      const address = wallet.address;
      expect(address).toEqual(res.address)
    })
  })

  describe('sign payload', () => {
    const { signPayloadMock } = require('./mock')

    it('should return proper result', () => {
      signPayloadMock.forEach(async (e) => {
        const res = await wallet.sign(e.privateKey, e.payload)
        expect(res).toEqual(e.result)
      })
    })
  })

  describe('send transaction', () => {
    // todo
    // faucet
    // monitor blockchain for txn
    // validate to
    // validate amount
  })

})