const express = require('express');
const router = express.Router();
const { register, login, getProfile, addToWishlist, removeFromWishlist, addAddress } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/profile/address', protect, addAddress);

router.post('/wishlist/add', protect, addToWishlist);
router.delete('/wishlist/remove', protect, removeFromWishlist);

module.exports = router;
