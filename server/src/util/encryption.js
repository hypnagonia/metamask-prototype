const { Buffer } = require('buffer')
const crypto = require('crypto')

const encrypt = async (passphrase, payload) => {
  const salt = generateSalt()
  const cryptoKey = await keyFromPassword(passphrase, salt)
  const encryptedData = await encryptWithKey(cryptoKey, payload)

  return {
    encryptedData,
    salt
  }
}

const decrypt = async (passphrase, salt, body) => {
  const cryptoKey = await keyFromPassword(passphrase, salt)

  return await decryptWithKey(
    cryptoKey,
    body
  )
}

const generateSalt = (byteCount = 32) => {
  const view = new Uint8Array(byteCount)
  crypto.getRandomValues(view)
  const b64encoded = btoa(
    String.fromCharCode.apply(null, view)
  )
  return b64encoded
}

const DERIVED_KEY_FORMAT = 'AES-GCM'
const STRING_ENCODING = 'utf-8'

const encryptWithKey = async (
  key,
  payload
) => {
  const p = JSON.stringify(payload)
  const dataBuffer = Buffer.from(p, STRING_ENCODING)
  const vector = crypto.getRandomValues(new Uint8Array(16))

  const buffer = await crypto.subtle.encrypt(
    {
      name: DERIVED_KEY_FORMAT,
      iv: vector,
    },
    key,
    dataBuffer,
  )

  const buffer8 = new Uint8Array(buffer)
  const vectorStr = Buffer.from(vector).toString('base64')
  const vaultStr = Buffer.from(buffer8).toString('base64')
  return {
    data: vaultStr,
    iv: vectorStr,
  }
}

const decryptWithKey = async (key, payload) => {
  const encryptedData = Buffer.from(payload.data, 'base64')
  const vector = Buffer.from(payload.iv, 'base64')

  let decryptedObj
  try {
    const result = await crypto.subtle.decrypt(
      { name: DERIVED_KEY_FORMAT, iv: vector },
      key,
      encryptedData,
    )

    const decryptedData = new Uint8Array(result)
    const decryptedStr = Buffer.from(decryptedData).toString(STRING_ENCODING)
    decryptedObj = JSON.parse(decryptedStr)
  } catch (e) {
    throw new Error('Incorrect password')
  }

  return decryptedObj
}


const keyFromPassword = async (
  password,
  salt,
  exportable = false,
) => {
  const passBuffer = Buffer.from(password, STRING_ENCODING)
  const saltBuffer = Buffer.from(salt, 'base64')

  const key = await crypto.subtle.importKey(
    'raw',
    passBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: 350000,
      hash: 'SHA-256',
    },
    key,
    { name: DERIVED_KEY_FORMAT, length: 256 },
    exportable,
    ['encrypt', 'decrypt'],
  )

  return derivedKey
}


module.exports = {
  encrypt,
  decrypt
}