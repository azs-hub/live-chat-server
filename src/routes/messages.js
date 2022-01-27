var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const connectDb = require('../models');

import { ErrorHandler } from '../utils/errors';
import { v4 as uuidv4 } from 'uuid';

import { sendMessage } from '../controllers/messagesController';

// router.post('/chatroom', createChatRoom);
router.post('/', authenticateToken, sendMessage);

// use a JWT for message sended by an admin
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)
    console.log('authenticateToken user:', user);
    req.user = user

    next()
  })
}

module.exports = router;