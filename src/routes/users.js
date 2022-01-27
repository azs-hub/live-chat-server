var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

import { createUser, siginUser } from '../controllers/usersController';

/* POST users */
router.post('/', createUser);
router.post('/singup', siginUser);

module.exports = router;
