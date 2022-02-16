var express = require('express');
var router = express.Router();
const authenticateToken = require('../utils/authToken');
import { createChatRoom, connectChatRoom, getChatList } from '../controllers/chatsController';

router.post('/', createChatRoom);
router.post('/connect', connectChatRoom);
router.get('/:page', authenticateToken, getChatList);

module.exports = router;