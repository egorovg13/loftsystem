const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');

const server = http.createServer(app);
const io = require('socket.io').listen(server);


require('./auth/passport');
require('./db');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/my_first_db');

app.use(express.static(path.join(process.cwd(), 'build')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', require('./routes'));
app.use('*', (_req, res) => {
  const file = path.resolve(__dirname, '../build', 'index.html');
  console.log('Запрос не к /api, выдаем index.html...');
  res.sendFile(file);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
});

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

const currentUsers = {};
const messageHistory = {};

io.on('connection', (socket) => {
  socket.on('users:connect', (data) => {
    const user = {...data, socketId: socket.id, activeRoom: null};
    currentUsers[socket.id] = user;
    console.log(currentUsers);

    socket.emit('users:list', Object.values(currentUsers));
    socket.broadcast.emit('users:add', user);
  });

  socket.on('disconnect', () => {
    delete currentUsers[socket.id];

    socket.broadcast.emit('users:leave', socket.id);
  });

  socket.on('message:add', (data) => {
    socket.emit('message:add', data);
    socket.broadcast.to(data.roomId).emit('message:add', data);
    addMessage(data.senderId, data.recipientId, data);
    addMessage(data.recipientId, data.senderId, data);
  });

  socket.on('message:history', (data) => {
    if (messageHistory[data.userId] && messageHistory[data.userId][data.recipientId]) {
      socket.emit('message:history', messageHistory[data.userId][data.recipientId]);
      console.log(messageHistory);
    }
  });
});

const addMessage = (senderId, recipientId, message) => {
  if (messageHistory[senderId]) {
    if (messageHistory[senderId][recipientId]) {
      messageHistory[senderId][recipientId].push(message);
    } else {
      messageHistory[senderId][recipientId] = [];
      messageHistory[senderId][recipientId].push(message);
    }
  } else {
    messageHistory[senderId] = {};
    messageHistory[senderId][recipientId] = [];
    messageHistory[senderId][recipientId].push(message);
  }
};
