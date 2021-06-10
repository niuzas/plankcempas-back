const express = require('express');

const router = express.Router();

const { isLoggedIn } = require('../../middleware');

router.get('/homepage', (req, res) => {
  res.send({
    text: 'Plankcempas yra lietuvos nacionalinis sportas išlaikant savo kūno svorį virš pečių.',
  });
});

router.get('/', isLoggedIn, (req, res) => {
  res.send({ msg: 'content is delivered successfully' });
});

module.exports = router;
