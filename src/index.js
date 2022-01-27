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

io.on('connection', function(socket) {

  console.log('io.sockets A user is connected');
  console.log(socket.id);

  socket.on('joinRoom', ({ username, uuid, token }) => {

    console.log('socket, joinRoom', username, uuid, token);
    // const user = userJoin(socket.id, username, room);

    // socket.join(user.room);

    // // Welcome current user
    // socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    // // Broadcast when a user connects
    // socket.broadcast
    //   .to(user.room)
    //   .emit(
    //     'message',
    //     formatMessage(botName, `${user.username} has joined the chat`)
    //   );

    // // Send users and room info
    // io.to(user.room).emit('roomUsers', {
    //   room: user.room,
    //   users: getRoomUsers(user.room)
    // });
  });

  // when the admin is sending a message
  // save it on databse by using model
  // and callback the front-end to get it back
  socket.on('SEND_MESSAGE', function(data) {
    console.log('SEND_MESSAGE', data);
    io.emit('MESSAGE', data)
  });

  socket.on('CREATE_CHAT', function(data) {
    console.log('SOCKET ON CREATE_CHAT', data);
    createChatRoomSocket(data).then((res) => {
      console.log('SOCKET ON CREATE_CHAT createChatRoomSocket then', res);
      io.emit('CHAT_CREATED', res)
    })
    .catch((err) => {
      console.log('SOCKET ON CREATE_CHAT createChatRoomSocket catch', err);
    })
    
  });
});