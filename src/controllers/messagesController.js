const connectDb = require('../models');

import Helper from '../utils/helper';
import {
  errorMessage, successMessage, status,
} from '../utils/status';

const sendMessage = async (req, res) => {
	const { content, sendby, chat_id } = req.body;

	const query = `INSERT INTO helpcenter.messages (content, sendby, chat_id, datetime) VALUES ($1, $2, $3, NOW()) RETURNING *`;
	const values = [content, sendby, chat_id];

	try {
		const { rows } = await connectDb.query(query, values);
		const dbResponse = rows[0];
		return res.status(status.created).send(dbResponse);
	} catch (err) {
		errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
	}
};

const getChatMessages = async (req, res) => {
	const { chat_id } = req.params;

	const query = `SELECT * FROM helpcenter.messages WHERE chat_id=$1;`;
	const values = [chat_id];

	try {
		const { rows } = await connectDb.query(query, values);
		const dbResponse = rows;
		return res.status(status.created).send(dbResponse);
	} catch (err) {
		errorMessage.error = 'Operation was not successful';
    return res.status(status.error).send(errorMessage);
	}
};

export {
  sendMessage,
  getChatMessages
};