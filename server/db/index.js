const mongoose = require('mongoose');
const User = require('./models/user');

module.exports.getUserById = async (id) => {
    console.log(`ищем пользователя по ID: ${id}`);
    let result = await User.findOne({_id: id});
    console.log(`результат поиска: ${result}`)
    return result;
}

module.exports.getUserByName = async (userName) => {
    console.log(`Начинаем поиск пользователя ${userName}`)
    let result = await User.findOne({username: userName});
    console.log(`результат поиска: ${result}`)
    return result;
}

module.exports.createUser = async (data) => {
    const { username, surName, firstName, middleName, password } = data;

    const newUser = new User({
        username: username,
        firstName: firstName,
        middleName: middleName,
        surName: surName,
        image: '',
        permission: {
            chat: { C: true, R: true, U: true, D: true },
            news: { C: true, R: true, U: true, D: true },
            settings: { C: true, R: true, U: true, D: true }
        }
    });

    newUser.setPassword(password);
    const user = await newUser.save();
    console.log(`пользователь сохранен`);
    return user;
}