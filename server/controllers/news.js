const mongoose = require('mongoose');
const { Profiler } = require('react');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const newsSchema = new Schema ({ 
  text: String, 
  title: String
})

const News = mongoose.model('news', newsSchema);

module.exports.post = (req, res) => {
    mongoose.connect('mongodb://localhost:27017/my_first_db');

    console.log('начало работы контролера news')
    console.log(process.cwd())
    console.log('---', req.url);
    console.log(req.body);

    let newsData = req.body;
    let news = new News(newsData)

    news.save().then((doc) => {
      console.log('object saved', doc);
      mongoose.disconnect();
      res.send(doc);
    }).catch((err) => {
      console.log(err);
      mongoose.disconnect();
    })
  };