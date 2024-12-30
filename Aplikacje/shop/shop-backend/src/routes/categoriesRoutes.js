const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getCategories } = require('../controller/categoriesController');

router.get('/', authenticateToken, getCategories);

module.exports = router;