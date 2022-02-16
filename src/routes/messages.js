var express = require('express');
var router = express.Router();
const authenticateToken = require('../utils/authToken');

import { sendMessage, getChatMessages } from '../controllers/messagesController';

// router.post('/chatroom', createChatRoom);
router.post('/', authenticateToken, sendMessage);
router.get('/:chat_id', authenticateToken, getChatMessages);

module.exports = router;