const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getOrder, creatOrders, updateOrders, getOrderById, getOrderByCustomer, getOrderByStatus, creatOpinion} = require('../controller/ordersController');

router.get('/', authenticateToken, getOrder);
router.post('/', creatOrders);
router.patch('/:id', authenticateToken, updateOrders);
router.get('/:id', authenticateToken, getOrderById);
router.get('/customer/test', authenticateToken, getOrderByCustomer);
router.get('/status/:status_id', authenticateToken, getOrderByStatus);
router.post('/:id/opinions', creatOpinion);

module.exports = router;

