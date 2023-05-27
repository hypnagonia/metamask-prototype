const ethers = require('ethers')

const toKeccak256 = value => ethers.keccak256(ethers.toUtf8Bytes(value.toString()))

module.exports = {
    toKeccak256
}