const Order = require('../models/Order');
const Cart = require('../models/Cart');

const placeOrder = async (req, res, next) => {
  try {
    const { userId, items, shippingAddress, pricing, paymentMethod } = req.body;
    
    if (items && items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    const orderId = `AMZ-${Date.now()}`;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4); 

    const order = new Order({ orderId, userId, items, shippingAddress, pricing, paymentMethod, estimatedDelivery });
    const createdOrder = await order.save();

    await Cart.findOneAndUpdate({ userId }, { items: [] });
    res.status(201).json(createdOrder);
  } catch (error) { next(error); }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ placedAt: -1 });
    res.json(orders);
  } catch (error) { next(error); }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (order) res.json(order);
    else { res.status(404); throw new Error('Order not found'); }
  } catch (error) { next(error); }
};

module.exports = { placeOrder, getUserOrders, getOrderById };
