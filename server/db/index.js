const User = require('./models/user');
const News = require('./models/news');

module.exports.getUserById = async (id) => {
  const result = await User.findOne({_id: id});
  return result;
};

module.exports.getUserByName = async (userName) => {
  const result = await User.findOne({username: userName});
  return result;
};

module.exports.createUser = async (data) => {
  const {username, surName, firstName, middleName, password} = data;

  const newUser = new User({
    username: username,
    firstName: firstName,
    middleName: middleName,
    surName: surName,
    image: '',
    permission: {
      chat: {C: true, R: true, U: true, D: true},
      news: {C: true, R: true, U: true, D: true},
      settings: {C: true, R: true, U: true, D: true},
    },
  });

  newUser.setPassword(password);
  const user = await newUser.save();
  console.log(`пользователь сохранен`);
  return user;
};


module.exports.updateUser = async (id, data) => {
  await User.findOneAndUpdate(
      {_id: id},
      {
        firstName: data.name,
        middleName: data.middleName,
        surName: data.surname,
        image: data.src,
      },
      {
        new: true,
      },
  );
};

module.exports.updatePermissions = async (id, data) => {
  const selectedUser = await User.findOne({_id: id});
  selectedUser.permission = data.permission;
  const patchedPermissions = await selectedUser.save();
  if (patchedPermissions) {
    return true;
  } else {
    return false;
  }
};

module.exports.deleteUser = async (id) => {
  await User.deleteOne({_id: id}, (err) => {
    if (err) {
      console.log('err');
      return false;
    } else {
      return true;
    }
  });
};

module.exports.getAllUsers = async () => {
  const userList = await User.find();
  return userList;
};

module.exports.getAllNews = async () => {
  const newsList = await News.find();
  return newsList;
};

module.exports.createNews = async (newsData, userData) => {
  const dateObj = new Date();
  const day = dateObj.getDate();
  const month = dateObj.getMonth();
  const date = day + '-' + month;

  const newNews = new News({

    created_at: date,
    text: newsData.text,
    title: newsData.title,

    user: {
      firstName: userData.firstName,
      id: userData.id,
      image: userData.image,
      middleName: userData.middleName,
      surName: userData.surName,
      username: userData.username,
    },
  });

  const savedNews = await newNews.save();
  return savedNews;
};

module.exports.deleteNews = async (id) => {
  await News.deleteOne({_id: id}, (err) => {
    if (err) {
      console.log('err');
      return false;
    } else {
      return true;
    }
  });
};

module.exports.updateNews = async (id, newTitle, newText) => {
  const result = await News.findOneAndUpdate(
      {_id: id},
      {
        title: newTitle,
        text: newText,
      },
      {
        new: true,
      },
  );

  return result;
};

