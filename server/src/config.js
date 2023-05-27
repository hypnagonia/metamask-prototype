const dotenv = require('dotenv')

const getConfig = (envPath) => {
    dotenv.config({ path: envPath })

    const config = {
        wallet: {
            passphraseSalt: process.env.PASSPHRASE_SALT,
            rpc: {
                url: process.env.RPC_URL
            },
            gasLimit: 60000,
            gasPrice: 100
        },
        api: {
            port: +process.env.API_PORT || 3001,
            auth: {
                jwt: {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '24h',
                },
                frontendCallbackUrl: process.env.FRONTEND_URL,
                google: {
                    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
                    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
                }
            }
        },
        storage: {
            location: './db',
            createIfMissing: true
        },
        logger: {
            levels: ['error', 'info', 'warn', 'debug'],
            showTimestamp: false
        }
    }

    return config
}


module.exports = {
    getConfig
}