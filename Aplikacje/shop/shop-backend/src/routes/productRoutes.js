const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, seoDescription} = require('../controller/productsController');

router.get('/', getProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.post('/:id/seo-description', authenticateToken, seoDescription);


module.exports = router;