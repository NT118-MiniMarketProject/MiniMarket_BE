const express = require('express');
const router = express.Router();
const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const CartController = require('../controllers/cart.controller')

router.route('/')
      .post(authenticateUser, CartController.AddToCart)
      .get([authenticateUser,authorizePermissions('customer')], CartController.GetCartByUser)

router.route('/:id')
      .patch([authenticateUser,authorizePermissions('customer')], CartController.UpdateCart)
    
module.exports = router;