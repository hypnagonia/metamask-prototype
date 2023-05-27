const passport = require('passport')
const jwt = require('jsonwebtoken')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

passport.serializeUser((user, cb) => {
    cb(null, user)
})

passport.deserializeUser((o, cb) => {
    cb(null, o)
})

const auth = (api, config) => {
    api.use(passport.initialize())
    const jwtOptions = {
        secretOrKey: config.jwt.secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    passport.use(new JwtStrategy(jwtOptions, (payload, done) => {
        return done(null, payload.userId)
    }))

    passport.use(
        new GoogleStrategy(
            {
                clientID: config.google.clientID,
                clientSecret: config.google.clientSecret,
                callbackURL: config.google.callbackURL
            },
            (accessToken, refreshToken, profile, done) => {
                done(null, profile.id)
            }
        ))

    api.get('/auth/google',
        passport.authenticate('google', { scope: ['profile', 'email'] }))

    api.get('/auth/google/callback',
        passport.authenticate('google', { session: false }),
        (req, res) => {
            const token = jwt.sign({ userId: req.user }, config.jwt.secret, { expiresIn: config.jwt.expiresIn })
            res.redirect(config.frontendCallbackUrl + `?token=${token}`)
        })

    return passport
}

module.exports = {
    auth
}