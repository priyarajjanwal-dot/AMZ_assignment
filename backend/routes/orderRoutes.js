const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, getOrderById } = require('../controllers/orderController');

router.post('/', placeOrder);
router.get('/:userId', getUserOrders);
router.get('/detail/:orderId', getOrderById);

module.exports = router;
