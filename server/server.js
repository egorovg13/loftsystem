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

// mongoose.connect('mongodb://localhost:27017/my_first_db');

// const Profile = mongoose.model('profile', profileSchema);
// const user = new Profile ({
//   username: 'Gri', 
//   surName: 'Egorov',
//   firstName: 'Grisha', 
//   password: 123
// })

// user.save().then((doc) => {
//   console.log('object saved', doc);
//   mongoose.disconnect();
// }).catch((err) => {
//   console.log(err);
//   mongoose.disconnect();
// })



const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(process.cwd(), 'build')));
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/', require('./routes/index'));

app.use('/api', require('./routes'))
app.use('*', (_req, res) => {
  const file = path.resolve(__dirname, 'build', 'index.html')
  console.log('сработал *')
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
