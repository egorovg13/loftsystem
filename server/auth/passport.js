const passport = require('passport')
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const db = require('../db/index')

const params = {
    secretOrKey: 'loft',
    jwtFromRequest: function (req) {
        let token = null
        
        if (req && req.headers) {
            token = req.headers['authorization']
        }

        return token
    }
}

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            var user = await db.getUserByName(username)
        } catch (error) {
            return done(error)
        }

        if(user && user.validPassword(password)) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
)

passport.use(
    new JWTStrategy(params, async (payload, done) => {
        try {
            var user = await db.getUserByName(payload.id)
        } catch (error) {
            return done(error)
        }

        if (user) {
            console.log(`пользователь найден с id ${user.id }`);
            done(null, { id: user.id })
        } else {
            done(new Error('User not found'))
        }
    })
)

