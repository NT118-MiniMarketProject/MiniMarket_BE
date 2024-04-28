const express = require('express');
const router = express.Router();

const {addWishList, removeWishList} = require('../controllers/product.controller')
const  {
    authenticateUser
} = require('../middleware/authentication')

router.post('/wishlist/add', authenticateUser, addWishList)
router.post('/wishlist/remove', authenticateUser, removeWishList)
module.exports = router