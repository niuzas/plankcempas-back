const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const router = express.Router();

const { mysqlConfig } = require('../../config');

const userSchema = Joi.object({
  email: Joi.string().email().max(250).trim().lowercase(),
  password: Joi.string().min(6).max(250),
});

router.post('/register', async (req, res) => {
  let userData;
  try {
    userData = await userSchema.validateAsync({
      email: req.body.email,
      password: req.body.password,
    });
  } catch (e) {
    return res.status(400).send({ error: 'Incorrect data passed' });
  }

  try {
    const con = await mysql.createConnection(mysqlConfig);

    const hashedPassword = bcrypt.hashSync(userData.password, 10);

    const [data] = await con.execute(
      `INSERT INTO users (email, password) VALUES (${mysql.escape(
        userData.email,
      )}, '${hashedPassword}')`,
    );

    if (data.affectedRows !== 1) {
      return res
        .status(500)
        .send({ error: 'An unexpected error occurred. Please try again' });
    }

    return res.send({ msg: 'Successfully registered an account' });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ error: 'An unexpected error occurred. Please try again' });
  }
});

module.exports = router;
