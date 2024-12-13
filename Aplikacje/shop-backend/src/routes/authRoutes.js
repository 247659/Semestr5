const express = require('express');
const router = express.Router();
const { register, login, refresh } = require('../controller/authController');

router.get('/login', login);
router.post('/register', register);
router.patch('/refresh', refresh);


module.exports = router;