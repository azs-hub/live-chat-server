const jwt = require('jsonwebtoken');

// use a JWT for message sended by an admin
module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log('authHeader:', authHeader);
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

    if (err) return res.sendStatus(403)
    console.log('authenticateToken user:', user);
    req.user = user

    next()
  })
}

// export default authenticateToken;