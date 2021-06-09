const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('./config');

module.exports = {
  isLoggedIn(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decodedToken = jwt.verify(token, jwtSecretKey);
      req.user = decodedToken;
      return next();
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: 'Unauthorized access to site' });
    }
  },
};
