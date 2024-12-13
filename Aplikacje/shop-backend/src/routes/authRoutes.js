const express = require('express');
const router = express.Router();
const { register, login, refresh } = require('../controller/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);


module.exports = router;