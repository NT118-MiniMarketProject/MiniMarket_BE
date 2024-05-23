const express = require('express');
const router = express.Router();
const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const OrderController = require('../controllers/order.controller')

router.route('/')
      .post(authenticateUser, OrderController.CreateOrder)
      .get(authenticateUser, OrderController.OrderList)

router.route('/:id').get(authenticateUser, OrderController.DetailOrder)

module.exports = router