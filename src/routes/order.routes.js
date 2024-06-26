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
      .delete(authenticateUser, OrderController.CancelOrder)

router.route('payment/').get(payment.checkOutVNPay)

module.exports = router