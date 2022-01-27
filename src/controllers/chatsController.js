const connectDb = require('../models');
const TokenGenerator = require('uuid-token-generator');
import Helper from '../utils/helper';
import {
  errorMessage, successMessage, status,
} from '../utils/status';

// When a user entre the help center
// Generate a chat linked to the user
// A Token is generate as password linked to username
const createChatRoom = async (req, res) => {
	const { username } = req.body;
	const createChatQuery = `INSERT INTO helpcenter.chats (username,  start_date, is_closed, status) VALUES ($1, NOW(), $2, $3) RETURNING *`;

	const values = [username, false, 'waiting'];

  console.log("values: ", values);

  try {
  	const { rows } = await connectDb.query(createChatQuery, values);
    var data = rows[0];
    // before return shall chall for <jwt
    const token = Helper.generateToken({
      id: rows[0].id,
      name: rows[0].username,
      role: false});
    data.token = token;

    return res.status(status.created).send(data);

  } catch (error) {
   	errorMessage.routine = error.routine;
    errorMessage.error = 'Operation was not successful';
    console.log(error);
    return res.status(status.error).send(errorMessage);
  }
};

// To be able to send message, A user has to be connected
// A JWT has to be in the header of get and post message request
// Use connectChatRoom to get a valid JWT
const connectChatRoom = async (req, res) => {
  const { username, chat_id } = req.body;
  if (Helper.isEmpty(username) || Helper.isEmpty(chat_id)) {
    errorMessage.error = 'Username or chat_id detail is missing';
    return res.status(status.bad).send(errorMessage);
  }

  const getChatQuery = 'SELECT * FROM helpcenter.chats WHERE username=$1 AND id=$2 ';
  try {
    const { rows } = await connectDb.query(getChatQuery, [username, chat_id]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = 'Chat does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    const token = Helper.generateToken({
      id: dbResponse.id,
      name: dbResponse.username,
      role: false});
    var data = dbResponse;
    data.token = token;
    return res.status(status.success).send(data);
  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  createChatRoom,
  connectChatRoom
};