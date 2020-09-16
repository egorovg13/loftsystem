// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// mongoose.Promise = global.Promise;

// const loginSchema = new Schema ({ 
//   username: String, 
//   password: String,
// })

// const Login = mongoose.model('login', loginSchema);

// module.exports.post = (req, res) => {
//     mongoose.connect('mongodb://localhost:27017/my_first_db');

//     console.log('начало работы контролера login')
//     console.log('---', req.url);

//     let userData = req.body;
//     let loginAttempt = new Login(userData);

//     loginAttempt.save().then((doc) => {
//       console.log('object saved', doc);
//       mongoose.disconnect();
//       res.send(doc);
//     }).catch((err) => {
//       console.log(err);
//       mongoose.disconnect();
//     })
//   };

////////////

// var _ = require("lodash");
// var express = require("express");
// var bodyParser = require("body-parser");
// var jwt = require('jsonwebtoken');

// var passport = require("passport");
// var passportJWT = require("passport-jwt");

// const db = require('../db/index');
// const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// var ExtractJwt = passportJWT.ExtractJwt;
// var JwtStrategy = passportJWT.Strategy;

// var jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// jwtOptions.secretOrKey = 'tasmanianDevil';

// var strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
//   console.log('payload received', jwt_payload);

//   // usually this would be a database call:
//   mongoose.connect('mongodb://localhost:27017/my_first_db');
//   const user = await db.getUserById(jwt_payload.id);
//   mongoose.disconnect();

//   // var user = users[_.findIndex(users, {id: jwt_payload.id})];

//   if (user) {
//     next(null, user);
//   } else {
//     next(null, false);
//   }
// });

// passport.use(strategy);

// module.exports.post = async (req, res) => {
//   mongoose.connect('mongodb://localhost:27017/my_first_db');

//   console.log('запрос на логин..')
//   let username = req.body.username;
//   let password = req.body.password;
//   console.log(req.body)

//   const user = await db.getUserByName(username);
//   if (!user) {
//     console.log(`пользователь ${username} не существует`);
//     res.status(400);
//     return
//   }

//   console.log('пользователь найден - продолжаем');

//   if (user.password === password) {
//     let payload = {id: user._id};
//     let token = jwt.sign(payload, jwtOptions.secretOrKey);
//     console.log(`выдан токен ${token}`);



//     res.json({

//     });





//     console.log('успешная аутентификация')
//   } else {
//     console.log(`incorret password : ${password}`)
//   }

//   mongoose.disconnect();
// }

const express = require('express')
const passport = require('passport')
const token = require('../auth/token')
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.post = async (req, res) => {
  mongoose.connect('mongodb://localhost:27017/my_first_db');
  passport.authenticate('local', { session: false }, (err, user) => {
      if (err) console.log(err)
      if (user) {
          const tokens = token.createTokens(user, 'loft')

          res.json({
              firstName: user.firstName,
              id: user._id,
              image: user.image,
              middleName: user.middleName,
              permission: user.permission,
              surName: user.surName,
              username: user.userName,
              ...tokens
          })
      } else {
          res.status(401).json({
            statusMessage: 'Error',
            data: {
                status: 401,
                message: 'Unauthorized'
            }})
      }
  })(req, res);
  // mongoose.disconnect()
};

// router.post('/refresh-token', (req, res) => {
//   const refresh = req.headers['authorization']
//   const tokens = token.refreshTokens(refresh, 'loft')
//   console.log(tokens)

//   res.json({...tokens})
// })

module.exports.refresh = async (req, res) => {
    const refresh = req.headers['authorization']
    const tokens = token.refreshTokens(refresh, 'loft')
    console.log('tokens refreshed')

  res.json({...tokens})
}

module.exports.profile = async (req, res) => {
  mongoose.connect('mongodb://localhost:27017/my_first_db');
  console.log('начинаем проверку токена на profile')
  passport.authenticate('jwt', {session: false}, (err, user) => {
      if (err) console.log(err)
      if (user) {
          res.json(user)
      } else {
          res.status(401).json({
            statusMessage: 'Error',
            data: {
                status: 401,
                message: 'Unauthorized'
            }})
      }
  })(req, res);
  
  // mongoose.disconnect()
};

// router.get('/profile', auth, (req, res) => {
//   res.json({
//       status: 1
//   })
// })

// module.exports = router;