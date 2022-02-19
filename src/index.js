import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import routes from './routes';
import { createChatRoomSocket } from './controllers/messagesController';

const app = express();

// add CORS HTTP header to every request by default
app.use(cors());

// Middleware to convert data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes setting
// app.use('/session', routes.session);
app.use('/users', routes.user);
app.use('/messages', routes.message);
app.use('/chats', routes.chat);

// Express error middleware
app.get('*', function (req, res, next) {

  const error = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );
 
  error.statusCode = 301;
 
  next(error);
});
// No status code will redirect to a 500
// Or redirect to a 404
app.use((error, req, res, next) => {
  console.log('MIDDLEWARE', error);

  if (!error.statusCode) error.statusCode = 500;
 
  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }
 
  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});

var server = app.listen(process.env.PORT, () =>
	console.log(`Example app listening on port ${process.env.PORT}!`),
	);

var io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:8080",
    allowedHeaders: ["*"],
  }
});

console.log('io.sockets', io.sockets.sockets);

let users = [];
let messages = {
  generale: [],
  random: [],
  javascript: [],
};

// run when a client connect
io.on('connection', function(socket) {

  socket.on('join server', (username) => {
    const user = {
      name: username,
      id: socket.id
    };

    console.log('[socket - join] user', user);
    users.push(user);
    // tell to all the person connected to the socket
    io.emit('new user', users);
  });
  socket.on('join room', (roomName) => {
    socket.join(roomName);
    console.log('[socket - join room] roomName', roomName);
  });

  // content: msg data
  // to: chatName || sockId
  // sender: who send
  // chatName: room name
  // isChannel: 
  socket.on('send msg', ({content, to, sender, chatName, isChannel}) => {
    console.log('[socket send msg]', isChannel);
    
    const playload = {
      content,
      chatName,
      sender
    };
    socket.to(to).emit('new msg', playload);
    
    // }
    if (messages[chatName]) {
      messages[chatName].push({
        sender,
        content
      })
    }
  });

  socket.on('leave room', () => {
    console.log('-----> DISCONECT')
    users = users.filter(u => u.id !== socket.id);
    io.emit('new user', users);
  });
  socket.on('disconnecting', () => {
    console.log('-----> DISCONECTING', users)
    users = users.filter(u => u.id !== socket.id);
    io.emit('new user', users);
    console.log('-----> DISCONECTING2', users)
  });
});