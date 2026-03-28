const Cart = require('../models/Cart');

const getCart = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id;
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(p => p.productId && p.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    }
    
    cart = await cart.populate('items.productId');
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(p => p.productId && p.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
      }
      cart = await cart.populate('items.productId');
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = cart.items.filter(p => p.productId && p.productId.toString() !== productId);
      await cart.save();
      cart = await cart.populate('items.productId');
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
      res.json(cart);
    } else {
      res.status(404);
      throw new Error('Cart not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
