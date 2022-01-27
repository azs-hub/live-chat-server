var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

import { createChatRoom, connectChatRoom } from '../controllers/chatsController';

router.post('/', createChatRoom);
router.post('/connect', connectChatRoom);

module.exports = router;