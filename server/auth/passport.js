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
            var userid = payload.user.id
            console.log(`searching for user with ID ${userid}`);
            var user = await db.getUserById(userid)
        } catch (error) {
            return done(error)
        }

        if (user) {
            console.log(`пользователь найден с id ${userid}`);
            done(null, { id: userid })
        } else {
            done(new Error('User not found'))
        }
    })
)

