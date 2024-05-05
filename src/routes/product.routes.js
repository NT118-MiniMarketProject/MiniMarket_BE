const express = require('express');
const router = express.Router();

const {addWishList, removeWishList, getProductsInWishList} = require('../controllers/product.controller')
const  {
    authenticateUser
} = require('../middleware/authentication')

router.get('/wishlist', authenticateUser, getProductsInWishList)
router.post('/wishlist/add', authenticateUser, addWishList)
router.post('/wishlist/remove', authenticateUser, removeWishList)
module.exports = router