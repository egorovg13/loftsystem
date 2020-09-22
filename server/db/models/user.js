const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  username: String,
  firstName: String,
  middleName: String,
  surName: String,
  image: String,
  hash: String,
  permission: {
    chat: {C: Boolean, R: Boolean, U: Boolean, D: Boolean},
    news: {C: Boolean, R: Boolean, U: Boolean, D: Boolean},
    settings: {C: Boolean, R: Boolean, U: Boolean, D: Boolean},
  },
});

userSchema.methods.setPassword = function(password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.hash);
};

const User = mongoose.model('logins', userSchema);

module.exports = User;
