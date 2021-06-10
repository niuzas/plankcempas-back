const jwt = require('jsonwebtoken');
const Joi = require('joi');

const { jwtSecretKey } = require('./config');

const userSchema = Joi.object({
  email: Joi.string().email().max(250).trim().lowercase(),
  password: Joi.string().min(6).max(250),
});

module.exports = {
  async isAuthDataCorrect(req, res, next) {
    let userData;
    try {
      userData = await userSchema.validateAsync({
        email: req.body.email,
        password: req.body.password,
      });
      req.userData = userData;
      return next();
    } catch (e) {
      return res.status(400).send({ error: 'Incorrect data passed' });
    }
  },
  isLoggedIn(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decodedToken = jwt.verify(token, jwtSecretKey);
      req.user = decodedToken;
      return next();
    } catch (e) {
      return res.status(400).send({ error: 'Unauthorized access to site' });
    }
  },
};
