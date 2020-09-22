// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// mongoose.Promise = global.Promise;

// const profileSchema = new Schema ({
//   username: String,
//   surName: String,
//   firstName: String,
//   middleName: String,
//   password: String
// })

// const Profile = mongoose.model('profile', profileSchema);

// module.exports.post = (req, res) => {
//     mongoose.connect('mongodb://localhost:27017/my_first_db');

//     console.log('начало работы контролера')
//     console.log(process.cwd())
//     console.log('---', req.url);

//     let userData = req.body;
//     let user = new Profile(userData)

//     user.save().then((doc) => {
//       console.log('object saved', doc);
//       mongoose.disconnect();
//       res.send(doc);
//     }).catch((err) => {
//       console.log(err);
//       mongoose.disconnect();
//     })
//   };

const db = require('../db/index');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.post = async (req, res) => {
  // mongoose.connect('mongodb://localhost:27017/my_first_db');
  const name = req.body.username;
  const user = await db.getUserByName(name);
  if (user) {
    console.log('Пользователь с этим ником уже существует');
    res.status(400);
    return;
    // не останавливает создание пользователя..
  }

  console.log('создаем нового пользователя..');
  const newUser = await db.createUser(req.body);
  console.log(`new user created: ${newUser}`);
  res.send(newUser);
  // mongoose.disconnect();
};
