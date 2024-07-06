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

router.route('/getAll').get([authenticateUser, authorizePermissions('admin')], OrderController.getAllOrdersForAdmin)

router.route('/:id')
      .get(authenticateUser, OrderController.DetailOrder)
      .put(authenticateUser, OrderController.UpdateOrder)
      .delete([authenticateUser, authorizePermissions('customer')], OrderController.CancelOrder)
router.route('/admin/:id').delete([authenticateUser, authorizePermissions('admin')], OrderController.cancelOrderAdm)
module.exports = router