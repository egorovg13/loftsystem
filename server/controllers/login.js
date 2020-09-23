const passport = require('passport');
const token = require('../auth/token');
const db = require('../db/index');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.post = async (req, res) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) console.log(err);
    if (user) {
      const tokens = token.createTokens(user, 'loft');

      res.json({
        firstName: user.firstName,
        id: user._id,
        image: user.image,
        middleName: user.middleName,
        permission: user.permission,
        surName: user.surName,
        username: user.username,
        ...tokens,
      });
    } else {
      res.status(401).json({
        statusMessage: 'Error',
        data: {
          status: 401,
          message: 'Unauthorized',
        }});
    }
  })(req, res);
};

module.exports.refresh = async (req, res) => {
  const refresh = req.headers['authorization'];
  const tokens = token.refreshTokens(refresh, 'loft');
  console.log('tokens refreshed');

  res.json({...tokens});
};

module.exports.auth = async (req, res, next) => {
  console.log(`AUTH START`);
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (!user || err) {
      console.log(`AUTH ERR`);
      res.status(401).json({
        statusMessage: 'Error',
        data: {
          status: 401,
          message: 'Unauthorized',
        },
      });
    } else {
      console.log(`AUTH SUCCESS`);
      res.locals.id = user.id;
      next();
    }
  })(req, res, next);
};

module.exports.getProfile = ( async (req, res) => {
  const {id} = res.locals;
  const userObj = await db.getUserById(id);
  res.json(userObj);
});

module.exports.updateProfile = ( async (req, res) => {
  const {id} = res.locals;
  const userRecord = await db.getUserById(id);
  const form = new formidable.IncomingForm();
  const upload = path.join('./build/assets', 'img');

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }

    const updateObj = {};

    if (files.avatar) {
      const fileName = path.join(upload, files.avatar.name);

      fs.rename(files.avatar.path, fileName, (err) => {
        if (err) {
          console.log(err);
        }
      });

      const publicPath = fileName.substr(fileName.indexOf('/assets'));
      updateObj.image = publicPath;
    }

    Object.keys(fields).forEach( (key) => {
      if ((fields[key]) && (fields[key]) !== 'null') {
        updateObj[key] = fields[key];
      }
    });

    Object.keys(updateObj).forEach( (key) => {
      switch (key) {
        case 'firstName':
          userRecord.firstName = updateObj[key];
          break;
        case 'middleName':
          userRecord.middleName = updateObj[key];
          break;
        case 'surName':
          userRecord.surName = updateObj[key];
          break;
        case 'image':
          userRecord.image = updateObj[key];
          break;
        case 'oldPassword':
          if (userRecord.validPassword(updateObj[key])) {
            console.log('old password provided correct');
            if (updateObj.newPassword) {
              userRecord.setPassword(updateObj.newPassword);
            }
          } else {
            console.log('old password is incorrect');
          };
          break;
        default:
          console.log(`default case triggered at ${key}`);
          break;
      }
    });

    const returnUpdatedUser = async () => {
      const updatedUser = await db.getUserById(id);
      res.json(updatedUser);
    };

    userRecord.save().then(returnUpdatedUser());
  });
});

module.exports.userList = ( async (req, res) => {
  console.log(`req.baseUrl is ${req.baseUrl}`);
  console.log(`req.url is ${req.url}`);
  console.log(`req.originalUrl is ${req.originalUrl}`);

  const users = await db.getAllUsers();

  const userWithIds = users.map( (userObj) => {
    const newObj = userObj._doc;
    newObj.id = userObj._id;
    delete newObj.hash;
    delete newObj._id;

    return newObj;
  });

  res.json(userWithIds);
});

module.exports.delete = (async (req, res) => {
  const userId = req.params.userId;
  db.deleteUser(userId);
  res.json({});
});

module.exports.permissions = async (req, res) => {
  const id = req.params.userId;
  const result = await db.updatePermissions(id, req.body);
  if (result) {
    res.json({});
  } else {
    res.json({
      statusMessage: 'Error',
      data: {
        status: 401,
        message: 'Error when updating permissions',
      },
    });
  }
};
