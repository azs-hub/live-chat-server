const connectDb = require('../models');

import Helper from '../utils/helper';

import {
  errorMessage, successMessage, status,
} from '../utils/status';

const createUser = async (req, res) => {
	const { username, password } = req.body;
  if (!username || !password) {
    errorMessage.error = 'Name or password cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }

  const hashPassword = Helper.hashPassword(password);

  const createUserQuery = `INSERT INTO helpcenter.users (username, password) VALUES ($1, $2) RETURNING id, username`;
  
  const values = [username, hashPassword];

  try {
    const { rows } = await connectDb.query(createUserQuery, values);
    const dbResponse = rows[0];

    const token = Helper.generateToken({
        id: dbResponse.id,
        name: dbResponse.username,
        role: true});
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'User with that NAME already exist';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

const siginUser = async (req, res) => {
  const { username, password } = req.body;
  if (Helper.isEmpty(username) || Helper.isEmpty(password)) {
    errorMessage.error = 'Username or Password detail is missing';
    return res.status(status.bad).send(errorMessage);
  }
  const signinUserQuery = 'SELECT * FROM helpcenter.users WHERE username = $1';
  try {
    const { rows } = await connectDb.query(signinUserQuery, [username]);
    const dbResponse = rows[0];
    console.log('dbResponse:', dbResponse);
    if (!dbResponse) {
      errorMessage.error = 'Username does not exist';
      return res.status(status.notfound).send(errorMessage);
    }
    if (!Helper.comparePassword(dbResponse.password, password)) {
      errorMessage.error = 'The password you provided is incorrect';
      return res.status(status.bad).send(errorMessage);
    }
    console.log('---->:');
    const token = Helper.generateToken({
        id: dbResponse.id,
        name: dbResponse.username,
        role: true});
    console.log('---->: TOKEN');
    successMessage.data = dbResponse;
    delete successMessage.data.password;
    successMessage.data.token = token;
    console.log('successMessage:', successMessage);
    return res.status(status.success).send(successMessage);

  } catch (error) {
    errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
  }
};

export {
  createUser,
  siginUser,
};