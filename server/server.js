const express = require('express');
const path = require('path');
// const _ = require("lodash");

const bodyParser = require("body-parser");

require('./auth/passport');
require('./db');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/my_first_db');

// const jwt = require('jsonwebtoken');
// const passport = require("passport");
// const passportJWT = require("passport-jwt");

// const ExtractJwt = passportJWT.ExtractJwt;
// const JwtStrategy = passportJWT.Strategy;

const app = express();

app.use(express.static(path.join(process.cwd(), 'build')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//////

// const jwtOptions = {}
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// jwtOptions.secretOrKey = 'tasmanianDevil';

// const strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
//   console.log('payload received', jwt_payload);
//   // usually this would be a database call:


//   var user = users[_.findIndex(users, {id: jwt_payload.id})];


//   if (user) {
//     next(null, user);
//   } else {
//     next(null, false);
//   }
// });

// passport.use(strategy);

///////

app.use('/api', require('./routes'))
app.use('*', (_req, res) => {
  const file = path.resolve(__dirname, '../build', 'index.html')
  console.log('Запрос не к /api, выдаем index.html...')
  res.sendFile(file)
})

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})
