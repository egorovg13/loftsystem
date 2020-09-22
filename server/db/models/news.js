const mongoose = require('mongoose');
const Schema = mongoose.Schema;


mongoose.Promise = global.Promise;

const newsSchema = new Schema({
  created_at: String,
  text: String,
  title: String,
  user: {
    firstName: String,
    id: String,
    image: String,
    middleName: String,
    surName: String,
    username: String,
  },
});

const News = mongoose.model('news', newsSchema);

module.exports = News;
