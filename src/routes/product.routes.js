const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller')
const  {
    authenticateUser
} = require('../middleware/authentication')

//wishList
router.get('/wishlist', authenticateUser, productController.getProductsInWishList)
router.post('/wishlist/add', authenticateUser, productController.addWishList)
router.post('/wishlist/remove', authenticateUser, productController.removeWishList)

//product
router.route('/')
      .get(productController.GetAllProducts)
module.exports = router