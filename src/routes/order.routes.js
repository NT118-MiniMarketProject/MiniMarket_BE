const express = require('express');
const router = express.Router();
const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const OrderController = require('../controllers/order.controller')
const payment = require('../controllers/payment')

router.route('/')
      .post(authenticateUser, OrderController.CreateOrder)
      .get(authenticateUser, OrderController.OrderList)

router.route('/:id')
      .get(authenticateUser, OrderController.DetailOrder)
      .put(authenticateUser, OrderController.UpdateOrder)

router.route('payment/').get(payment.checkoutVNPay)

module.exports = router