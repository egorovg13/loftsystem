const db = require('../db/index');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports.post = async (req, res) => {
  const name = req.body.username;
  const user = await db.getUserByName(name);
  if (user) {
    console.log('Пользователь с этим ником уже существует');
    res.status(401).json({
      statusMessage: 'Error',
      data: {
        status: 400,
        message: 'User already exists',
      },
    });
  } else {
    console.log('создаем нового пользователя..');
    const newUser = await db.createUser(req.body);
    console.log(`new user created: ${newUser}`);
    res.send(newUser);
  }
};
