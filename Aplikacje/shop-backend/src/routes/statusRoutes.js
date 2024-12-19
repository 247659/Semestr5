const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getStatus } = require('../controller/statusController');

router.get('/', authenticateToken, getStatus);

module.exports = router;