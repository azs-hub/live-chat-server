import 'dotenv/config';
const { Pool, Client } = require('pg')

// Web application makes frequent queries
// Pool connection is adviced
const pool = new Pool({
	user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
})

pool.on('connect', () => {
  console.log('connected to the db');
});

module.exports = {
	query: (text, params) => {
		const start = Date.now()

		return new Promise((resolve, reject) => {
      pool.query("SET search_path TO 'helpcenter';")
      pool.query(text, params)
      .then((res) => {
      	const duration = Date.now() - start
      	console.log('executed query', { text, duration, rows: res.rowCount })
        
        resolve(res);
      })
      .catch((err) => {
      	const duration = Date.now() - start
      	console.log('executed query with error', { text, duration})
        reject(err);
      })
    })
	},

}

