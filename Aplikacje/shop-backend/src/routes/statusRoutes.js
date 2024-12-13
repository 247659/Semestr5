const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { makeInit } = require('../controller/statusController');

router.get('/', authenticateToken, makeInit);

module.exports = router;