const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { makeInit } = require('../controller/initializationController');

router.post('/', authenticateToken, makeInit);

module.exports = router;